import { User } from "./domain/user";
import { UserServiceError } from "./errors";
import type { IUserCacheRepository } from "./repo/cache.repo";
import type { IUserRepository } from "./repo/db.repo";
import type { CreateUserRequestType, UpdateUserType } from "./types";

type EnsureUserExistsInput = {
	authProvider: string;
	authUserId: string;
	email: string;
	name?: string | null;
	emailVerified?: boolean;
	avatarUrl?: string | null;
};

export interface IUserService {
	getInstance(): IUserService;

	createUser(params: CreateUserRequestType): Promise<User>;
	ensureUserExists(params: EnsureUserExistsInput): Promise<User>;
	findById(id: string): Promise<User | null>;
	findByExternalId(externalId: string): Promise<User | null>;
	updateProfile(params: UpdateUserType): Promise<User>;
	delete(id: string): Promise<void>;
	toggleOnlineStatus(id: string): Promise<boolean>;
}

export type UserServiceProps = {
	repo: IUserRepository;
	cacheRepo: IUserCacheRepository;
};

export class UserService implements IUserService {
	private readonly repo: IUserRepository;
	private readonly cacheRepo: IUserCacheRepository;

	constructor(props: UserServiceProps) {
		this.repo = props.repo;
		this.cacheRepo = props.cacheRepo;
	}

	getInstance(): IUserService {
		return this;
	}

	/**
	 * Creates a brand new local app user.
	 */
	async createUser(params: CreateUserRequestType): Promise<User> {
		const existing = await this.findByExternalId(params.externalId);

		if (existing) {
			throw new UserServiceError("User already exists", 409);
		}

		const user = User.create({
			externalId: params.externalId,
			email: params.email ?? null,
			firstName: params.firstName ?? null,
			lastName: params.lastName ?? null,
			avatarUrl: params.avatarUrl ?? null,
			metadata: {},
		});

		const serialized = user.toObject();

		await this.repo.saveUser(serialized);
		await this.cacheRepo.saveUser(serialized);

		return user;
	}

	/**
	 * Used by auth after successful Cognito login/signup.
	 * If user exists -> return it.
	 * Else create local user record.
	 */
	async ensureUserExists(params: EnsureUserExistsInput): Promise<User> {
		const existing = await this.findByExternalId(params.authUserId);

		if (existing) {
			return existing;
		}

		const [firstName, ...rest] = (params.name ?? "").trim().split(" ");
		const lastName = rest.length > 0 ? rest.join(" ") : null;

		const user = User.create({
			externalId: params.authUserId,
			email: params.email,
			firstName: firstName || null,
			lastName,
			avatarUrl: params.avatarUrl ?? null,
			metadata: {
				authProvider: params.authProvider,
				emailVerified: params.emailVerified ?? false,
			},
		});

		const serialized = user.toObject();

		await this.repo.saveUser(serialized);
		await this.cacheRepo.saveUser(serialized);

		return user;
	}

	async findById(id: string): Promise<User | null> {
		const cached = await this.cacheRepo.findUserById(id);
		if (cached) {
			return User.rehydrate(cached);
		}

		const data = await this.repo.findUserById({ id });
		if (!data) return null;

		await this.cacheRepo.saveUser(data);

		return User.rehydrate(data);
	}

	async findByExternalId(externalId: string): Promise<User | null> {
		const cached = await this.cacheRepo.findUserByExternalId(externalId);
		if (cached) {
			return User.rehydrate(cached);
		}

		const data = await this.repo.findUserByExternalId({ externalId });
		if (!data) return null;

		await this.cacheRepo.saveUser(data);

		return User.rehydrate(data);
	}

	async updateProfile(params: UpdateUserType): Promise<User> {
		const existing = await this.repo.findUserById({ id: params.userId });

		if (!existing) {
			throw new UserServiceError("User not found", 404);
		}

		const user = User.rehydrate(existing);

		user.updateProfile({
			firstName: params.firstName,
			lastName: params.lastName,
			email: params.email,
			avatarUrl: params.avatarUrl,
		});

		await this.repo.updateUser({
			userId: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			avatarUrl: user.toObject().avatarUrl,
		});

		await this.cacheRepo.saveUser(user.toObject());

		return user;
	}

	async toggleOnlineStatus(id: string): Promise<boolean> {
		const existing = await this.repo.findUserById({ id });

		if (!existing) {
			throw new UserServiceError(`User with ID ${id} not found`, 404);
		}

		const user = User.rehydrate(existing);
		user.toggleOnline();

		await this.repo.updateUser({
			userId: user.id,
			online: user.isOnline,
			lastSeenAt: user.isOnline ? null : new Date().toISOString(),
		});

		const refreshed = await this.repo.findUserById({ id: user.id });
		if (refreshed) {
			await this.cacheRepo.saveUser(refreshed);
		}

		return user.isOnline;
	}

	async delete(id: string): Promise<void> {
		const existing = await this.repo.findUserById({ id });

		if (!existing) {
			throw new UserServiceError("User not found", 404);
		}

		await this.repo.markUserAsDeleted({ userId: id });
		await this.cacheRepo.deleteUser({
			id: existing.id,
			externalId: existing.externalId,
		});
	}
}
