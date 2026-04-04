import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import type { AuthServieEnv } from "@/types";
import type { IUserService } from "./service";
import {
	createUserRequestSchema,
	errorResponseSchema,
	selectUserSchema,
	successResponseSchema,
	successResponseSchemaWithData,
	updateUserProfileRequestSchema,
	userIdParamSchema,
} from "./types";

export const createUserRoute = (service: IUserService) => {
	const app = new Hono<AuthServieEnv>();

	/**
	 * GET /user/:id
	 * Retrieve user by internal ID
	 */
	app.get(
		"/:id",
		describeRoute({
			operationId: "getUserById",
			description: "Retrieve a user by internal ID",
			responses: {
				200: {
					description: "User retrieved successfully",
					content: {
						"application/json": {
							schema: resolver(successResponseSchemaWithData(selectUserSchema)),
						},
					},
				},
				404: {
					description: "User not found",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
			},
		}),
		validator("param", userIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");

			const user = await service.findById(id);

			if (!user) {
				return c.json({ success: false, error: "User not found" }, 404);
			}

			return c.json({ success: true, data: user.toObject() }, 200);
		}
	);

	/**
	 * POST /user/
	 * Create/sync user from Kinde external ID
	 */
	app.post(
		"/",
		describeRoute({
			operationId: "createUser",
			description: "Create or sync a user using external identity provider ID",
			responses: {
				201: {
					description: "User created successfully",
					content: {
						"application/json": {
							schema: resolver(successResponseSchemaWithData(selectUserSchema)),
						},
					},
				},
				400: {
					description: "Invalid request body",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
				500: {
					description: "Failed to create user",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
			},
		}),
		validator("json", createUserRequestSchema),
		async (c) => {
			const body = c.req.valid("json");

			const user = await service.createUser(body.externalId);

			return c.json({ success: true, data: user.toObject() }, 201);
		}
	);

	/**
	 * PATCH /user/:id/profile
	 * Update user profile
	 */
	app.patch(
		"/:id/profile",
		describeRoute({
			operationId: "updateUserProfile",
			description: "Update user profile fields",
			responses: {
				200: {
					description: "User updated successfully",
					content: {
						"application/json": {
							schema: resolver(successResponseSchemaWithData(selectUserSchema)),
						},
					},
				},
				400: {
					description: "Invalid request body",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
				404: {
					description: "User not found",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
				500: {
					description: "Failed to update user",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
			},
		}),
		validator("param", userIdParamSchema),
		validator("json", updateUserProfileRequestSchema),
		async (c) => {
			const { id } = c.req.valid("param");
			const body = c.req.valid("json");

			try {
				const updatedUser = await service.updateProfile({
					userId: id,
					...body,
				});

				return c.json({ success: true, data: updatedUser.toObject() }, 200);
			} catch (_error) {
				return c.json({ success: false, error: "Update failed" }, 500);
			}
		}
	);

	/**
	 * POST /user/:id/online
	 * Toggle online status
	 */
	app.post(
		"/:id/online",
		describeRoute({
			operationId: "toggleOnlineStatus",
			description: "Toggle the user's online status",
			responses: {
				200: {
					description: "Online status toggled successfully",
					content: {
						"application/json": {
							schema: resolver(successResponseSchema),
						},
					},
				},
				404: {
					description: "User not found",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
				500: {
					description: "Failed to toggle online status",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
			},
		}),
		validator("param", userIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");

			try {
				const isOnline = await service.toggleOnlineStatus(id);

				return c.json({ success: true, data: { isOnline } }, 200);
			} catch (_error) {
				return c.json({ success: false, error: "Status toggle failed" }, 500);
			}
		}
	);

	/**
	 * DELETE /user/:id
	 * Soft delete user
	 */
	app.delete(
		"/:id",
		describeRoute({
			operationId: "deleteUser",
			description: "Soft delete a user by internal ID",
			responses: {
				200: {
					description: "User deleted successfully",
					content: {
						"application/json": {
							schema: resolver(successResponseSchema),
						},
					},
				},
				404: {
					description: "User not found",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
				500: {
					description: "Failed to delete user",
					content: {
						"application/json": {
							schema: resolver(errorResponseSchema),
						},
					},
				},
			},
		}),
		validator("param", userIdParamSchema),
		async (c) => {
			const { id } = c.req.valid("param");

			try {
				await service.delete(id);

				return c.json({ success: true, data: { id, deleted: true } }, 200);
			} catch (_error) {
				return c.json({ success: false, error: "Deletion failed" }, 500);
			}
		}
	);

	return app;
};
