export type EntryStatus = "draft" | "published" | "archived";

export interface SystemFields {
	createdAt: Date;
	updatedAt: Date;
	publishedAt?: Date;
}

export interface ContentEntry {
	id: string;

	collectionId: string;
	workspaceId?: string;

	slug?: string;

	data: Record<string, unknown>;

	status: EntryStatus;

	system: SystemFields;
}
