import type {
	WidgetConfig,
	WorkspaceSettings,
} from "@zero-heads-lab/shared/types";
import type { InferSelectModel } from "drizzle-orm";
import type {
	apikey as apiKeySchema,
	session as sessionSchema,
} from "../../drizzle/schemas/auth.schema";

export type IAuthMutationRepository = {
	markUserAsDeleted: (params: { userId: string }) => Promise<void>;
	createNewUserWithProfileTX: (params: { userId: string }) => Promise<void>;
	markUserAsVerified: (params: { userId: string }) => Promise<void>;
	createOrganizationWithProfileAndWidgetTX: (params: {
		organizationId: string;
		widgetConfig?: WidgetConfig;
		workspaceConfig?: WorkspaceSettings;
		subscriptionId?: string;
	}) => Promise<void>;
};

export type EmailVerificationStatus = {
	emailVerified: boolean;
};

export type OrganizationsCount = {
	count: number;
};

export type APIKey = InferSelectModel<typeof apiKeySchema>;
export type Session = InferSelectModel<typeof sessionSchema>;

export type IAuthQueryRepository = {
	findUserEmailVerificationStatus: (params: {
		userId: string;
	}) => Promise<EmailVerificationStatus | null>;

	findUserSessions: (params: { userId: string }) => Promise<Session[] | null>;

	countUserOrganizations: (params: {
		userId: string;
	}) => Promise<OrganizationsCount | null>;

	findApiKeyByWorkspaceId: (params: {
		workspaceId: string;
	}) => Promise<APIKey | null>;
};

export type IAuthRepository = {
	query: IAuthQueryRepository;
	mutation: IAuthMutationRepository;
};
