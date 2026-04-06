import { APIError, api } from "encore.dev/api";
import type { IUserService } from "./service";
import {
	createUserRequestSchema,
	updateUserProfileRequestSchema,
} from "./types";

export interface UserResponse {
	success: true;
	data: {
		id: string;
		externalId: string;
		firstName: string | null;
		lastName: string | null;
		email?: string | null;
		online: boolean;
		lastSeenAt?: Date | null;
		createdAt: Date;
		updatedAt: Date;
		deletedAt?: Date | null;
		banned?: boolean;
		bannedAt?: Date | null;
		bannedExpiresAt?: Date | null;
		bannedReason?: string | null;
	};
}

export interface ToggleOnlineResponse {
	success: true;
	data: {
		isOnline: boolean;
	};
}

export interface DeleteUserResponse {
	success: true;
	data: {
		id: string;
		deleted: boolean;
	};
}

export interface GetUserByIdParams {
	id: string;
}

export interface CreateUserBody {
	externalId: string;
}

export interface UpdateUserProfileRequest {
	id: string;
	firstName?: string | null;
	lastName?: string | null;
	email?: string;
	online?: boolean;
	lastSeenAt?: Date | null;
	banned?: boolean;
	bannedAt?: Date | null;
	bannedExpiresAt?: Date | null;
	bannedReason?: string | null;
}

// Initialize the service elsewhere
let userService: IUserService;

export function initService(service: IUserService) {
	userService = service;
}

// GET /user/:id
export const getUserById = api(
	{ method: "GET", path: "/user/:id", expose: true },
	async ({ id }: GetUserByIdParams): Promise<UserResponse> => {
		const user = await userService.findById(id);

		if (!user) {
			throw APIError.notFound("User not found");
		}

		return {
			success: true,
			data: user.toObject(),
		};
	}
);

// POST /user
export const createUser = api(
	{ method: "POST", path: "/user", expose: true },
	async (body: CreateUserBody): Promise<UserResponse> => {
		const parsed = createUserRequestSchema.parse(body);

		const user = await userService.createUser(parsed.externalId);

		return {
			success: true,
			data: user.toObject(),
		};
	}
);

// PATCH /user/:id/profile
export const updateUserProfile = api(
	{ method: "PATCH", path: "/user/:id/profile", expose: true },
	async (req: UpdateUserProfileRequest): Promise<UserResponse> => {
		const { id, ...body } = req;

		const parsed = updateUserProfileRequestSchema.parse(body);

		try {
			const updatedUser = await userService.updateProfile({
				userId: id,
				...parsed,
			});

			return {
				success: true,
				data: updatedUser.toObject(),
			};
		} catch (err) {
			throw APIError.internal("Update failed");
		}
	}
);

// POST /user/:id/online
export const toggleOnlineStatus = api(
	{ method: "POST", path: "/user/:id/online", expose: true },
	async ({ id }: GetUserByIdParams): Promise<ToggleOnlineResponse> => {
		try {
			const isOnline = await userService.toggleOnlineStatus(id);

			return {
				success: true,
				data: { isOnline },
			};
		} catch {
			throw APIError.internal("Status toggle failed");
		}
	}
);

// DELETE /user/:id
export const deleteUser = api(
	{ method: "DELETE", path: "/user/:id", expose: true },
	async ({ id }: GetUserByIdParams): Promise<DeleteUserResponse> => {
		try {
			await userService.delete(id);

			return {
				success: true,
				data: { id, deleted: true },
			};
		} catch {
			throw APIError.internal("Deletion failed");
		}
	}
);

interface EnsureUserExistsRequest {
	authProvider: "cognito";
	authUserId: string;
	email: string;
	name?: string;
	emailVerified?: boolean;
}

interface EnsureUserExistsResponse {
	id: string;
	created: boolean;
}

export const ensureUserExists = api<
	EnsureUserExistsRequest,
	EnsureUserExistsResponse
>(
	{
		method: "POST",
		path: "/internal/users/ensure",
		expose: false, // internal only
	},
	async (req) => {
		// TODO: replace with real DB logic
		return {
			id: crypto.randomUUID(),
			created: true,
		};
	}
);
