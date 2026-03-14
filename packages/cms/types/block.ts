import type { SchemaField } from "./schema";

export interface BlockDefinition {
	slug: string;
	label: string;
	fields: SchemaField[];
}

export interface BlockInstance {
	id: string;
	blockType: string;
	data: Record<string, unknown>;
}
