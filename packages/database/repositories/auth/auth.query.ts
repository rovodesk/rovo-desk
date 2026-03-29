import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { eq, sql } from "drizzle-orm";
import {
	apikey as apiKeySchema,
	member as memberSchema,
	organization as organizationSchema,
	session as sessionSchema,
	user as userSchema,
} from "../../drizzle/schemas/auth.schema";
import type {
	APIKey,
	EmailVerificationStatus,
	IAuthQueryRepository,
	OrganizationsCount,
	Session,
} from "./auth.types";

export class AuthQueryRepository implements IAuthQueryRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async findUserEmailVerificationStatus(params: {
		userId: string;
	}): Promise<EmailVerificationStatus | null> {
		return await this.tracer.withSpan(
			"auth.query.getUserEmailVerificationStatus",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				const [user] = await this.db
					.select({
						emailVerified: userSchema.emailVerified,
					})
					.from(userSchema)
					.where(eq(userSchema.id, params.userId))
					.limit(1);

				return user ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "user",
			}
		);
	}

	async findUserSessions(params: {
		userId: string;
	}): Promise<Session[] | null> {
		return await this.tracer.withSpan(
			"auth.query.findUserSessions",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				const session = await this.db
					.select()
					.from(sessionSchema)
					.where(eq(sessionSchema.userId, params.userId));

				if (session.length === 0) {
					return null;
				}

				return session;
			},
			{
				"db.operation": "select",
				"db.table": "session",
			}
		);
	}

	async countUserOrganizations(params: {
		userId: string;
	}): Promise<OrganizationsCount | null> {
		return await this.tracer.withSpan(
			"auth.query.countUserOrganizations",
			async (span) => {
				span.setAttribute("auth.user_id", params.userId);

				const [count] = await this.db
					.select({
						count: sql<number>`count(*)`,
					})
					.from(userSchema)
					.leftJoin(memberSchema, eq(memberSchema.userId, userSchema.id))
					.leftJoin(
						organizationSchema,
						eq(memberSchema.organizationId, organizationSchema.id)
					)
					.where(eq(userSchema.id, params.userId))
					.limit(1);

				return count ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "user,member,organization",
			}
		);
	}

	async findApiKeyByWorkspaceId(params: {
		workspaceId: string;
	}): Promise<APIKey | null> {
		return await this.tracer.withSpan(
			"auth.query.getApiKeyByWorkspaceId",
			async (span) => {
				span.setAttribute("auth.workspace_id", params.workspaceId);

				const [apiKey] = await this.db
					.select()
					.from(apiKeySchema)
					.where(eq(apiKeySchema.referenceId, params.workspaceId))
					.limit(1);

				return apiKey ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "apikey",
			}
		);
	}
}
