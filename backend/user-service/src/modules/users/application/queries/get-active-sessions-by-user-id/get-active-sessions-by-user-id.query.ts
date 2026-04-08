import type { SessionDto } from "../dto/user-response.dto";

export class GetActiveSessionsByUserIdQuery {
	constructor(readonly userId: string) {}
}

export type GetActiveSessionsByUserIdQueryResult = SessionDto[];
