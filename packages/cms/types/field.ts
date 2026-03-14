import type { AnimationConfig } from "./animation";

export type FieldType =
	| "text"
	| "textarea"
	| "richtext"
	| "number"
	| "boolean"
	| "date"
	| "media"
	| "json"
	| "select"
	| "relation"
	| "color"
	| "blocks"
	| "array";

export interface FieldValidation {
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
}

export interface FieldPermissions {
	read?: string[];
	create?: string[];
	update?: string[];
}

export interface FieldConfig {
	required?: boolean;
	unique?: boolean;
	indexed?: boolean;
	defaultValue?: unknown;

	placeholder?: string;
	description?: string;

	options?: string[];

	relationTo?: string;

	validation?: FieldValidation;

	hidden?: boolean;
	readonly?: boolean;

	animation?: AnimationConfig;
}
