export interface EntryVersion {
	id: string;
	entryId: string;

	data: Record<string, unknown>;

	createdAt: Date;
	createdBy?: string;
}
