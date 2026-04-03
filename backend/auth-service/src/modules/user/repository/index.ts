import type { Database } from "@zero-heads-lab/database";
import type { ITracer } from "@zero-heads-lab/observability";
import { MutationRepository } from "./mutation";
import { QueryRepository } from "./query";

export interface IUserRepository {
	query: QueryRepository;
	mutation: MutationRepository;
}

export class UserRepository implements IUserRepository {
	readonly query: QueryRepository;
	readonly mutation: MutationRepository;

	constructor(db: Database, tracer: ITracer) {
		this.query = new QueryRepository(db, tracer);
		this.mutation = new MutationRepository(db, tracer);
	}
}
