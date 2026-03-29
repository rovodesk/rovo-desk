import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { AuthMutationRepository } from "./auth.mutation";
import { AuthQueryRepository } from "./auth.query";
import type { IAuthRepository } from "./auth.types";

export class AuthRepository implements IAuthRepository {
	readonly query: AuthQueryRepository;
	readonly mutation: AuthMutationRepository;

	constructor(db: Database, tracer: ITracer) {
		this.query = new AuthQueryRepository(db, tracer);
		this.mutation = new AuthMutationRepository(db, tracer);
	}
}
