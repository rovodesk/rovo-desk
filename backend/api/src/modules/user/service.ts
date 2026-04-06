/** biome-ignore-all lint/suspicious/useAwait: <explanation> */
import type { ICacheStore } from "@zero-heads-lab/cache";
import type { ILogger, ITracer } from "@zero-heads-lab/observability";
import { z } from "zod";
import { UserServiceError } from "./errors";
import type { IUserRepository } from "./repository";
import type { KindeConfig, UpdateUserType } from "./types";
import { User } from "./user";

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

type EnsureUserExistsInput = {
	authProvider: string;
	authUserId: string;
	email: string;
	name: string;
	emailVerified: boolean;
};

export interface IUserService {
	getInstance(): IUserService;

	createUser(externalId: string): Promise<User>;
	ensureUserExists(params: EnsureUserExistsInput): Promise<User>;
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

type KindeTokenResponse = {
	access_token: string;
	expires_in?: number;
	token_type?: string;
	scope?: string;
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
		return this.tracer.withSpan("kinde.getAccessToken", async (span) => {
			const cacheKey = "kinde:m2m_token";
			span?.setAttribute("auth.provider", "kinde");
			span?.setAttribute("cache.key", cacheKey);

			// 1) Cache first
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

			// 2) Fetch fresh token
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

			const tokenResponse = (await response.json()) as KindeTokenResponse;

			const token = tokenResponse.access_token;

			if (!token) {
				throw new UserServiceError(
					"Kinde token response missing access_token",
					500
				);
			}

			this.logger.debug("Fetched fresh Kinde M2M token", {
				cacheKey,
				expiresIn: tokenResponse.expires_in,
				scope: tokenResponse.scope,
				tokenType: tokenResponse.token_type,
			});

			// 3) Cache token
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
		});
	}

	getInstance(): IUserService {
		return this;
	}

	private async getKindeUser(
		externalId: string,
		m2mToken: string
	): Promise<User> {
		return this.tracer.withSpan("kinde.getUser", async (span) => {
			span?.setAttribute("user.externalId", externalId);

			const url = `${this.kinde.domain}/api/v1/user?id=${encodeURIComponent(externalId)}`;

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${m2mToken}`,
					Accept: "application/json",
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

			return User.create({
				externalId: kindeUser.id,
				firstName: kindeUser.first_name,
				lastName: kindeUser.last_name,
				createdAt: kindeUser.created_on,
			});
		});
	}

	async ensureUserExists(params: EnsureUserExistsInput): Promise<User> {
		const user = User.create({
			externalId: params.authUserId,
			preferedEmail: params.email,
			firstName: params.name.split(" ")[0],
			lastName: params.name.split(" ")[1],
		});
		//TODO: SAVE

		return user;
	}

	/**
	 * Fetches a user from Kinde and creates a local record.
	 */
	async createUser(externalId: string): Promise<User> {
		return this.tracer.withSpan("user.createFromKinde", async (span) => {
			span?.setAttribute("user.externalId", externalId);

			const m2mToken = await this.getKindeAccessToken();
			const user = await this.getKindeUser(externalId, m2mToken);

			await this.repo.mutation.saveUser(user.toObject());

			this.logger.info("User created from Kinde", {
				userId: user.id,
				externalId,
			});

			return user;
		});
	}

	async findById(id: string): Promise<User | null> {
		return this.tracer.withSpan("user.findById", async (span) => {
			span?.setAttribute("user.id", id);

			const data = await this.repo.query.findUserById({ id });
			return data ? User.rehydrate(data) : null;
		});
	}

	async updateProfile(params: UpdateUserType): Promise<User> {
		return this.tracer.withSpan("user.updateProfile", async (span) => {
			span?.setAttribute("user.id", params.userId);

			const data = await this.repo.query.findUserById({ id: params.userId });

			if (!data) {
				throw new UserServiceError("User not found", 404);
			}

			const user = User.rehydrate(data);

			user.updateProfile({
				firstName: params.firstName,
				lastName: params.lastName,
			});

			await this.repo.mutation.updateUser({
				userId: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
			});

			return user;
		});
	}

	async toggleOnlineStatus(id: string): Promise<boolean> {
		return this.tracer.withSpan("user.toggleOnlineStatus", async (span) => {
			span?.setAttribute("user.id", id);

			const data = await this.repo.query.findUserById({
				id,
				fields: {
					online: true,
				},
			});

			if (!data) {
				throw new UserServiceError(`User with ID ${id} not found`, 404);
			}

			const user = User.rehydrate(data);
			user.toggleOnline();

			await this.repo.mutation.updateUser({
				userId: user.id,
				online: user.isOnline,
			});

			this.logger.info("User online status updated", {
				userId: id,
				isOnline: user.isOnline,
			});

			return user.isOnline;
		});
	}

	async delete(id: string): Promise<void> {
		await this.tracer.withSpan("user.delete", async (span) => {
			span?.setAttribute("user.id", id);

			await this.repo.mutation.markUserAsDeleted({ userId: id });

			this.logger.warn("User soft-deleted", { userId: id });
		});
	}
}
