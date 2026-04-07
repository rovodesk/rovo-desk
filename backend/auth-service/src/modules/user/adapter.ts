import { IRepository } from "@zero-heads-lab/database/adapter";
import type { UserSchema } from "./schema";

export abstract class IUserRepository extends IRepository<UserSchema> {
	abstract findById(id: string): Promise<UserSchema | null>;
}
