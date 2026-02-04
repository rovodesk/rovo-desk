import { v4 as uuid, validate } from "uuid";

export function generateUUID(prefix?: string) {
	return `${prefix || ""}${uuid()}`;
}

export function validateUUID(id: string) {
	return validate(id);
}
