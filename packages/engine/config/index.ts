import { z } from "zod";

export const ThemeModeSchema = z.enum(["dark", "light", "system"]);

export const DisplayOptionsSchema = z.object({
	offset: z
		.object({
			horizontal: z.number().optional(),
			vertical: z.number().optional(),
			zIndex: z.number().optional(),
		})
		.optional(),
	themeMode: ThemeModeSchema.optional(),
});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	createdAt: z.string(),
	signature: z.string(),
});

export const SDKConfigSchema = z.object({
	accessKey: z.string(),
	organizationId: z.string(),
	apiBaseUrl: z.url(),
	user: UserSchema.optional(),
	customLauncherComponent: z.string().optional(),
	display: DisplayOptionsSchema.optional(),
	sessionDuration: z.number().optional(),
});
