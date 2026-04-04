import type { ICacheStore } from "@zero-heads-lab/cache";
import { ServerError } from "@zero-heads-lab/global/errors";
import type { ILogger, ITracer } from "@zero-heads-lab/observability";
import { z } from "zod";
import type { KindeConfig } from "@/types";
import { User } from "./domain/user";
import type { IUserRepository } from "./repository";
import type { UpdateUserType } from "./types";

/**
 * Schema for Kinde API User Response
 */
const KindeUserProfile = z.object({
	id: z.string(),
	preferred_email: z.string().optional(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	is_suspended: z.boolean(),
	created_on: z.string(),
});

class UserServiceError extends ServerError {
	readonly status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = "UserServiceError";
		this.status = status;
	}
}

export interface IUserService {
	createUser(externalId: string): Promise<User>;
	findById(id: string): Promise<User | null>;
	updateProfile(params: UpdateUserType): Promise<User>;
	delete(id: string): Promise<void>;
	toggleOnlineStatus(id: string): Promise<boolean>;
}

export type UserServiceProps = {
	repo: IUserRepository;
	cacheStore: ICacheStore;
	tracer: ITracer;
	logger: ILogger;
	kinde: KindeConfig;
};

export class UserService implements IUserService {
	private readonly repo: IUserRepository;
	private readonly kinde: KindeConfig;
	private readonly tracer: ITracer;
	private readonly logger: ILogger;
	private readonly cache: ICacheStore;

	constructor(props: UserServiceProps) {
		this.repo = props.repo;
		this.kinde = props.kinde;
		this.tracer = props.tracer;
		this.logger = props.logger;
		this.cache = props.cacheStore.withPrefix("auth");
	}

	/**
	 * Retrieves or generates a Kinde M2M Access Token with caching.
	 */
	private async getKindeAccessToken(): Promise<string> {
		const cacheKey = "kinde:m2m_token";

		// 1. Try cache first
		try {
			const cachedToken = await this.cache.get<string>(cacheKey);
			if (cachedToken) {
				this.logger.debug("Using cached Kinde M2M token", {
					cacheKey,
					cachePrefix: this.cache.getPrefix(),
				});
				return cachedToken;
			}
		} catch (error) {
			this.logger.warn("Failed to read Kinde M2M token from cache", {
				cacheKey,
				cachePrefix: this.cache.getPrefix(),
				error,
			});
		}

		// 2. Fetch fresh token directly from Kinde
		const tokenUrl = `${this.kinde.domain}/oauth2/token`;

		const response = await fetch(tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json",
			},
			body: new URLSearchParams({
				grant_type: "client_credentials",
				client_id: this.kinde.clientId,
				client_secret: this.kinde.clientSecret,
				audience: `${this.kinde.domain}/api`,
				scope: "read:users",
			}).toString(),
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			const responseBody = await response.text();

			this.logger.error(
				"Failed to fetch Kinde M2M token",
				{
					status: response.status,
					url: tokenUrl,
					responseBody,
				},
				new Error(`Kinde token endpoint returned ${response.status}`)
			);

			throw new UserServiceError(
				`Failed to fetch Kinde M2M token (${response.status})`,
				response.status
			);
		}

		const tokenResponse = await response.json<{
			access_token: string;
			expires_in?: number;
			token_type?: string;
			scope?: string;
		}>();

		const token = tokenResponse.access_token;

		if (!token) {
			throw new UserServiceError(
				"Kinde token response missing access_token",
				500
			);
		}

		// Optional: log token metadata in debug
		this.logger.debug("Fetched fresh Kinde M2M token", {
			cacheKey,
			expiresIn: tokenResponse.expires_in,
			scope: tokenResponse.scope,
			tokenType: tokenResponse.token_type,
		});

		// 3. Cache it, but don't fail auth flow if cache write fails
		try {
			const ttl = tokenResponse.expires_in
				? Math.max(tokenResponse.expires_in - 60, 60)
				: 3000;

			await this.cache.set(cacheKey, token, ttl);
		} catch (error) {
			this.logger.warn("Failed to cache Kinde M2M token", {
				cacheKey,
				cachePrefix: this.cache.getPrefix(),
				error,
			});
		}

		return token;
	}

	private async getKindeUser(
		externalId: string,
		m2mToken: string
	): Promise<User> {
		const url = `${this.kinde.domain}/api/v1/user?id=${encodeURIComponent(externalId)}`;

		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${m2mToken}`,
			},
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			const responseBody = await response.text();

			this.logger.error(
				"Kinde user fetch failed",
				{
					status: response.status,
					externalId,
					url,
					responseBody,
				},
				new Error(`Kinde API returned ${response.status}`)
			);

			throw new UserServiceError(
				`Kinde user sync failed (${response.status})`,
				response.status
			);
		}

		const data = await response.json();
		const kindeUser = KindeUserProfile.parse(data);

		// 1. Instantiate via Domain Factory
		const user = User.create({
			externalId: kindeUser.id,
			firstName: kindeUser.first_name,
			lastName: kindeUser.last_name,
			createdAt: kindeUser.created_on,
		});

		return user;
	}
	/**
	 * Fetches a user from Kinde and creates a local record.
	 */
	async createUser(externalId: string): Promise<User> {
		return await this.tracer.withSpan("user.createFromKinde", async (span) => {
			span.setAttribute("user.externalId", externalId);

			const m2mToken = await this.getKindeAccessToken();
			this.logger.warn("M2M Token", { m2mToken });
			const user = await this.getKindeUser(externalId, m2mToken);

			// 2. Persist to DB
			await this.repo.mutation.saveUser(user.toObject());

			this.logger.info("User created from Kinde", { userId: user.id });
			return user;
		});
	}

	async findById(id: string): Promise<User | null> {
		const data = await this.repo.query.findUserById({ id });
		return data ? User.rehydrate(data) : null;
	}

	async updateProfile(params: UpdateUserType): Promise<User> {
		return await this.tracer.withSpan("user.updateProfile", async () => {
			// Fetch current state
			const data = await this.repo.query.findUserById({ id: params.userId });
			if (!data) throw new UserServiceError("User not found", 404);

			// Rehydrate into Domain Entity
			const user = User.rehydrate(data);

			// Apply domain logic (This handles internal field validation)
			user.updateProfile({
				firstName: params.firstName,
				lastName: params.lastName,
			});

			// Persist the WHOLE object or just the changes?
			// In your setup, passing the object back to mutation is best:
			await this.repo.mutation.updateUser({
				firstName: user.firstName,
				lastName: user.lastName,
				userId: user.id, // Mapping domain 'id' to repo 'userId'
			});

			return user;
		});
	}

	async toggleOnlineStatus(id: string): Promise<boolean> {
		return await this.tracer.withSpan(
			"user.toggleOnlineStatus",
			async (span) => {
				span.setAttribute("user.id", id);

				// 1. Fetch via Repository (This hits Cache first, then DB)
				const data = await this.repo.query.findUserById({
					id,
					fields: {
						online: true,
					},
				});
				if (!data) {
					throw new UserServiceError(`User with ID ${id} not found`);
				}

				// 2. Rehydrate into Domain Entity
				const user = User.rehydrate(data);

				// 3. Execute Domain Logic
				user.toggleOnline();

				// 4. Persist back to DB & Invalidate Cache
				// Note: Mapping domain 'id' to 'userId' for the UpdateUserType
				const userObj = user.toObject();
				await this.repo.mutation.updateUser({
					...userObj,
					userId: user.id,
				});

				this.logger.info(
					`User ${id} is now ${user.isOnline ? "online" : "offline"}`
				);

				return user.isOnline;
			}
		);
	}

	async delete(id: string): Promise<void> {
		await this.repo.mutation.markUserAsDeleted({ userId: id });
		this.logger.warn("User soft-deleted", { userId: id });
	}
}
