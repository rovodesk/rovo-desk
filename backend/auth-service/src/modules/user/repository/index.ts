import type { ICacheStore } from "@zero-heads-lab/cache";
import type { Database } from "@zero-heads-lab/database";
import type { ITracer } from "@zero-heads-lab/observability";
import { MutationRepository } from "./mutation";
import { QueryRepository } from "./query";

export interface IUserRepository {
	query: QueryRepository;
	mutation: MutationRepository;
}

export class UserRepository implements IUserRepository {
	readonly cacheStore: ICacheStore;
	readonly query: QueryRepository;
	readonly mutation: MutationRepository;

	constructor(db: Database, cacheStore: ICacheStore, tracer: ITracer) {
		this.cacheStore = cacheStore.withPrefix("user");
		this.query = new QueryRepository(db, tracer, this.cacheStore);
		this.mutation = new MutationRepository(db, tracer, this.cacheStore);
	}
}
