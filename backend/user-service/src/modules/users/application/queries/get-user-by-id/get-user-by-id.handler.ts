import { Injectable } from "@nestjs/common";
import { type IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { IUserRepository } from "../../../domain/repositories/user.repository.port";
import { UserMapper } from "../../../infrastructure/persistence/mappers/user.mapper";
import type { UserResponseDto } from "../../dto/user-response.dto";
import { GetUserByIdQuery } from "./get-user-by-id.query";

@Injectable()
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler
	implements IQueryHandler<GetUserByIdQuery, UserResponseDto | null>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(query: GetUserByIdQuery): Promise<UserResponseDto | null> {
		const user = await this.userRepository.findById(query.userId);

		if (!user) {
			return null;
		}

		return UserMapper.toPersistenceDto(user);
	}
}
