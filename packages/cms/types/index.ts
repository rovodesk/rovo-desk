import type { Collection } from "./collection";
import type { ContentEntry } from "./entry";
import type { Media } from "./media";
import type { EntryVersion } from "./version";

export * from "./animation";
export * from "./block";
export * from "./collection";
export * from "./entry";
export * from "./field";
export * from "./media";
export * from "./schema";
export * from "./version";

export type ViewType = "schema" | "content" | "preview";

export type SyncStatus = "synced" | "saving" | "unsaved";

export interface CMSState {
	collections: Record<string, Collection>;
	entries: Record<string, ContentEntry>;
	versions: Record<string, EntryVersion>;
	media: Record<string, Media>;

	activeCollectionId: string | null;
	activeEntryId: string | null;
	activeFieldId: string | null;

	view: ViewType;
	syncStatus: SyncStatus;
}
