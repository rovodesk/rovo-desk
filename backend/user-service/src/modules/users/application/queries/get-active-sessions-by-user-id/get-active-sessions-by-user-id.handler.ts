import { Injectable } from "@nestjs/common";
import { type IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { SessionDto } from "../../application/dto/user-response.dto";
import type { IUserRepository } from "../../domain/repositories/user.repository.port";
import type { UserMapper } from "../../infrastructure/persistence/mappers/user.mapper";
import {
	GetActiveSessionsByUserIdQuery,
	type GetActiveSessionsByUserIdQueryResult,
} from "./get-active-sessions-by-user-id.query";

@QueryHandler(GetActiveSessionsByUserIdQuery)
@Injectable()
export class GetActiveSessionsByUserIdQueryHandler
	implements
		IQueryHandler<
			GetActiveSessionsByUserIdQuery,
			GetActiveSessionsByUserIdQueryResult
		>
{
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly userMapper: UserMapper
	) {}

	async execute(query: GetActiveSessionsByUserIdQuery): Promise<SessionDto[]> {
		const user = await this.userRepository.findById(query.userId);

		if (!user) {
			return [];
		}

		const activeSessions = user.ActiveSessions;

		return activeSessions.map((session) => ({
			id: session.id,
			status: session.status.Value,
			createdAt: session.createdAt,
			lastSeenAt: session.lastSeenAt,
			expiresAt: session.expiresAt,
			revokedAt: session.revokedAt ?? null,
		}));
	}
}
