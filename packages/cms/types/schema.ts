import type { FieldConfig, FieldType } from "./field";

export interface SchemaField {
	id: string;
	name: string;
	type: FieldType;

	label?: string;
	group?: string;

	config?: FieldConfig;
}

export interface Schema {
	id: string;
	name: string;
	fields: SchemaField[];
}
