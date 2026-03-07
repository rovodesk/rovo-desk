import type { InferSelectModel } from "drizzle-orm";
import type { workspaceProfile } from "./drizzle/schemas/profile.schema";

export type WorkspaceProfile = InferSelectModel<typeof workspaceProfile>;
