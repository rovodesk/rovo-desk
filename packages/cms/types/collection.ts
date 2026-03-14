import type { SchemaField } from "./schema";

export interface CollectionPermissions {
	read?: string[];
	create?: string[];
	update?: string[];
	delete?: string[];
}

export interface Collection {
	id: string;

	name: string;
	slug: string;
	icon?: string;

	fields: SchemaField[];

	permissions?: CollectionPermissions;

	timestamps?: boolean;
	versions?: boolean;
	drafts?: boolean;

	workspaceId?: string;

	createdAt: Date;
	updatedAt: Date;
}
