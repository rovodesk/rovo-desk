import { Swagger } from "@zero-heads-lab/global/documentation";

export const SwagggerResponse = {
	createIdentity: {
		201: Swagger.defaultResponseJSON({
			status: 201,
			description: "Identity created successfully",
			json: {
				id: "iden_demo123",
				provider: "google",
				email: "dev@example.com",
				emailVerified: true,
				isPrimary: false,
				lastUsedAt: "2026-04-07T21:39:53.447Z",
				linkedAt: "2026-04-07T21:39:53.447Z",
				createdAt: "2026-04-07T21:39:53.447Z",
				updatedAt: "2026-04-07T21:39:53.447Z",
			},
		}),
		400: Swagger.defaultResponseError({
			status: 400,
			route: "/identity",
			description: "Bad Request - Invalid input data",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			route: "/identity",
		}),
	},
	getIdentity: {
		302: Swagger.defaultResponseJSON({
			status: 302,
			description: "Identity retrieved successfully",
			json: {
				id: "iden_demo123",
				provider: "google",
				email: "dev@example.com",
				emailVerified: true,
				isPrimary: false,
				lastUsedAt: "2026-04-07T21:45:39.276Z",
				linkedAt: "2026-04-07T21:45:39.276Z",
				createdAt: "2026-04-07T21:45:39.276Z",
				updatedAt: "2026-04-07T21:45:39.276Z",
			},
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/{identityId}",
			description: "Forbidden - You don't have access to this identity",
		}),
		404: Swagger.defaultResponseError({
			status: 404,
			route: "/identity/{identityId}",
			description: "Identity not found",
		}),
		500: Swagger.defaultResponseError({
			description: "Internal Server Error",
			status: 500,
			route: "/identity/{identityId}",
		}),
	},

	updateEmail: {
		202: Swagger.defaultResponseJSON({
			status: 202,
			description: "Identity email update requested",
			json: {
				id: "iden_demo123",
				provider: "google",
				email: "dev@example.com",
				emailVerified: true,
				isPrimary: false,
				lastUsedAt: "2026-04-07T21:45:39.276Z",
				linkedAt: "2026-04-07T21:45:39.276Z",
				createdAt: "2026-04-07T21:45:39.276Z",
				updatedAt: "2026-04-07T21:45:39.276Z",
			},
		}),
		404: Swagger.defaultResponseError({
			status: 404,
			route: "/identity/email",
			description: "Identity not found",
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/email",
			description: "Forbidden - You don't have access to update this identity",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			description: "Internal Server Error",
			route: "/identity/email",
		}),
	},
	setPrimaryIdentity: {
		202: Swagger.defaultResponseText({
			status: 200,
			text: "Primary identity set successfully",
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/primary",
			description: "Forbidden - You don't have access to update this identity",
		}),
		404: Swagger.defaultResponseError({
			status: 404,
			route: "/identity/primary",
			description: "Identity not found",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			description: "Internal Server Error",
			route: "/identity/primary",
		}),
	},
	touchIdenty: {
		202: Swagger.defaultResponseJSON({
			status: 202,
			description: "Identity last-used timestamp updated successfully",
			json: {
				id: "iden_demo123",
				provider: "google",
				email: "dev@example.com",
				emailVerified: true,
				isPrimary: false,
				lastUsedAt: "2026-04-07T21:45:39.276Z",
				linkedAt: "2026-04-07T21:45:39.276Z",
				createdAt: "2026-04-07T21:45:39.276Z",
				updatedAt: "2026-04-07T21:45:39.276Z",
			},
		}),
		404: Swagger.defaultResponseError({
			status: 404,
			route: "/identity/{identityId}/touch",
			description: "Identity not found",
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/{identityId}/touch",
			description: "Forbidden - You don't have access to update this identity",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			description: "Internal Server Error",
			route: "/identity/{identityId}/touch",
		}),
	},
	linkIdentitySelf: {
		201: Swagger.defaultResponseJSON({
			status: 201,
			description: "Identity linked successfully",
			json: {
				id: "iden_demo123",
				provider: "google",
				email: "dev@example.com",
				emailVerified: true,
				isPrimary: false,
				lastUsedAt: "2026-04-07T21:45:39.276Z",
				linkedAt: "2026-04-07T21:45:39.276Z",
				createdAt: "2026-04-07T21:45:39.276Z",
				updatedAt: "2026-04-07T21:45:39.276Z",
			},
		}),
		400: Swagger.defaultResponseError({
			status: 400,
			route: "/identity/link",
			description: "Bad Request - Invalid input data",
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/link",
			description: "Forbidden - You don't have access to link this identity",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			description: "Internal Server Error",
			route: "/identity/link",
		}),
	},
	linkIdentityAdmin: {
		201: Swagger.defaultResponseJSON({
			status: 201,
			description: "Identity linked successfully by admin",
			json: {
				id: "iden_demo123",
				provider: "google",
				email: "dev@example.com",
				emailVerified: true,
				isPrimary: false,
				lastUsedAt: "2026-04-07T21:45:39.276Z",
				linkedAt: "2026-04-07T21:45:39.276Z",
				createdAt: "2026-04-07T21:45:39.276Z",
				updatedAt: "2026-04-07T21:45:39.276Z",
			},
		}),
		400: Swagger.defaultResponseError({
			status: 400,
			route: "/identity/admin/link",
			description: "Bad Request - Invalid input data",
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/admin/link",
			description: "Forbidden - You don't have access to link this identity",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			description: "Internal Server Error",
			route: "/identity/admin/link",
		}),
	},
	unlinkIdentity: {
		200: Swagger.defaultResponseJSON({
			status: 200,
			description: "Identity unlinked successfully",
			json: {
				success: true,
				identityId: "iden_demo123",
			},
		}),
		400: Swagger.defaultResponseError({
			status: 400,
			route: "/identity/{identityId}/unlink",
			description: "Bad Request - Invalid input data",
		}),
		403: Swagger.defaultResponseError({
			status: 403,
			route: "/identity/{identityId}/unlink",
			description: "Forbidden - You don't have access to unlink this identity",
		}),
		404: Swagger.defaultResponseError({
			status: 404,
			route: "/identity/{identityId}/unlink",
			description: "Identity not found",
		}),
		500: Swagger.defaultResponseError({
			status: 500,
			description: "Internal Server Error",
			route: "/identity/{identityId}/unlink",
		}),
	},
};

export const SwagggerRequest = {
	/** If requesters has a body.  */
};
