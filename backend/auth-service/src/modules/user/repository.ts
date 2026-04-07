import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { TypeOrmRepository } from "@zero-heads-lab/database";
import { Repository } from "@zero-heads-lab/database/repository";
import { ConnectionName } from "@zero-heads-lab/database/types";
import type { IUserRepository } from "./adapter";
import { UserSchema } from "./schema";

@Injectable()
export class UserRepository
	extends Repository<UserSchema>
	implements IUserRepository
{
	constructor(
		@InjectRepository(UserSchema, ConnectionName.AUTH)
		private readonly entity: TypeOrmRepository<UserSchema>
	) {
		super(entity);
	}

	async findById(id: string): Promise<UserSchema | null> {
		return await this.entity.findOne({
			where: { id },
		});
	}
}
