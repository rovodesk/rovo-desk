import { verifyJWTToken } from "@zero-heads-lab/auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { WorkerEnv } from "../env";

function getBearerToken(authHeader?: string | null): string | null {
	if (!authHeader) return null;
	const [scheme, token] = authHeader.split(" ");
	if (scheme !== "Bearer" || !token) return null;
	return token;
}

export const authenticationMiddleware = () =>
	createMiddleware<WorkerEnv>(async (c, next) => {
		const authHeader =
			c.req.header("Authorization") ?? c.req.header("authorization");
		const token = getBearerToken(authHeader);

		if (!token) {
			c.env.logger.warn("auth.missing_bearer_token", {
				path: c.req.path,
				method: c.req.method,
			});
			throw new HTTPException(401, {
				message: "Unauthorized, missing bearer token",
			});
		}

		await c.env.tracer.withSpan(
			"auth.verify_jwt",
			async (span) => {
				span.setAttribute("auth.type", "bearer");
				span.setAttribute("auth.provider", "kinde");

				try {
					const payload = await verifyJWTToken(token, {
						domain: c.env.KINDE_DOMAIN,
						issuer: c.env.KINDE_ISSUER_URL,
					});

					c.set("auth", payload);
					c.set("jwtToken", token);

					// 🔥 Enrich logger with auth context for downstream handlers
					const authLogger = c.env.logger.withUser(
						payload.sub,
						payload.org_code,
						payload.roles?.[0]
					);

					span.setAttribute("auth.user_id", payload.sub);
					if (payload.org_code) {
						span.setAttribute("auth.workspace_id", payload.org_code);
					}

					authLogger.info("auth.verification.succeeded", {
						userId: payload.sub,
						workspaceId: payload.org_code,
					});

					await next();
				} catch (error) {
					span.setAttribute("auth.error", true);

					c.env.logger.error("auth.verification.failed", error, {
						path: c.req.path,
						method: c.req.method,
					});

					throw new HTTPException(401, {
						message: "Invalid or expired token",
					});
				}
			},
			{
				"auth.type": "bearer",
				"auth.provider": "kinde",
			}
		);
	});

export const requirePermission = (permission: string) =>
	createMiddleware<WorkerEnv>(async (c, next) => {
		const auth = c.get("auth");
		const logger = c.env.logger;

		if (!auth) {
			logger.warn("auth.missing_bearer_token", {
				path: c.req.path,
				method: c.req.method,
			});
			throw new HTTPException(401, { message: "Unauthorized" });
		}

		const permissions = auth.permissions ?? [];

		if (!permissions.includes(permission)) {
			logger.warn("auth.permission_check.forbidden", {
				userId: auth.sub,
				requiredPermission: permission,
				permissions,
			});
			throw new HTTPException(403, { message: "Forbidden" });
		}

		logger.debug("auth.permission_check.passed", {
			userId: auth.sub,
			requiredPermission: permission,
		});

		await next();
	});

export const requireRole = (role: string) =>
	createMiddleware<WorkerEnv>(async (c, next) => {
		const auth = c.get("auth");

		if (!auth) {
			c.env.logger.warn("auth.role_check.unauthorized", {
				requiredRole: role,
			});

			throw new HTTPException(401, { message: "Unauthorized" });
		}

		const roles = auth.roles ?? [];

		if (!roles.includes(role)) {
			c.env.logger.warn("auth.role_check.forbidden", {
				userId: auth.sub,
				requiredRole: role,
				roles,
			});

			throw new HTTPException(403, { message: "Forbidden" });
		}

		c.env.logger.debug("auth.role_check.passed", {
			userId: auth.sub,
			requiredRole: role,
		});

		await next();
	});

export const requireWorkspace = () =>
	createMiddleware<WorkerEnv>(async (c, next) => {
		const auth = c.get("auth");

		if (!auth?.org_code) {
			c.env.logger.warn("auth.workspace_required.missing", {
				userId: auth?.sub,
			});

			throw new HTTPException(403, {
				message: "Organization required",
			});
		}

		c.env.logger.debug("auth.workspace_check.passed", {
			userId: auth.sub,
			workspaceId: auth.org_code,
		});

		await next();
	});
