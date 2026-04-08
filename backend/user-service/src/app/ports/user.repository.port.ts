import type { User } from "@/domain/user";

export abstract class IUserRepository {
	abstract findById(id: string): Promise<User | null>;

	abstract findByEmail(email: string): Promise<User | null>;

	abstract findByIdentity(
		provider: string,
		providerUserId: string
	): Promise<User | null>;

	abstract existsById(id: string): Promise<boolean>;
	abstract save(user: User): Promise<User>;

	abstract delete(id: string): Promise<void>;
}
