import type { ITracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { Database } from "../../conn";
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
