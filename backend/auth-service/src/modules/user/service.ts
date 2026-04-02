import { createId } from "@paralleldrive/cuid2";
import type { SessionManager } from "@zero-heads-lab/auth";
import type { ITracer } from "@zero-heads-lab/observability";
import { z } from "zod";
import type { CredentialsClient } from "@/lib/auth-client";
import { type CreateUserProps, User } from "./domain/user";
import type { IUserRepository } from "./repository";

type CreateUserInput = {
	provider: string;
} & CreateUserProps;

const KindeUserProfile = z.object({
	sub: z.string(),
	provided_id: z.string(),
	name: z.string(),
	given_name: z.string(),
	family_name: z.string(),
	updated_at: z.number(),
	email: z.string(),
	email_verified: z.boolean(),
	picture: z.string(),
	preferred_username: z.string(),
	id: z.string(),
});

class UserServiceError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UserServiceError";
	}
}

export interface IUserService {
	createUser(params: CreateUserInput): Promise<User>;
}

export type UserServiceProps = {
	repo: IUserRepository;
	authClinet: CredentialsClient;
	sessionManager: SessionManager;
	kindeDomain: string;
	tracer: ITracer;
};

export class UserService implements IUserService {
	private readonly repo: IUserRepository;
	private readonly authClinet: CredentialsClient;
	private readonly sessionManager: SessionManager;
	private readonly kindeDomain: string;
	private readonly tracer: ITracer;

	constructor(props: UserServiceProps) {
		this.repo = props.repo;
		this.authClinet = props.authClinet;
		this.sessionManager = props.sessionManager;
		this.kindeDomain = props.kindeDomain;
		this.tracer = props.tracer;
	}

	async createUser(params: CreateUserInput): Promise<User> {
		// Check External Id
		const accessToken = await this.authClinet.getToken(this.sessionManager);

		// Make External Fetch Call
		const response = await fetch(`${this.kindeDomain}/oauth2/v2/user_profile`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new UserServiceError(
				`Failed to fetch Kinde users: ${response.status} ${errorText}`
			);
		}
		const data = await response.json();

		const parsed = KindeUserProfile.parse(data);
		if (!parsed.sub) {
			throw new UserServiceError("Kinde user not found");
		}

		// Create Domain User
		const user = new User({
			id: `user_${createId()}`,
			email: params.email,
			externalId: params.externalId,
			firstName: params.firstName,
			lastName: params.lastName,
		});

		await this.tracer.withSpan("user.create", async (span) => {
			span.setAttributes({
				"user.id": user.id,
				"user.externalId": user.externalId,
			});
			await this.repo.mutation.saveUser({
				user,
				provider: params.provider,
			});
		});

		return user;
	}
}
