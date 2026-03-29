import type { InferSelectModel } from "drizzle-orm";
import type { organization } from "./drizzle/schemas/auth.schema";
import type { workspaceProfile } from "./drizzle/schemas/profile.schema";

export type WorkspaceProfile = InferSelectModel<typeof workspaceProfile>;
export type OrganizationType = InferSelectModel<typeof organization>;
