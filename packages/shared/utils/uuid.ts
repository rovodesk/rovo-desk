import { v4 as uuid, validate } from "uuid";

export function generateUUID(prefix?: string) {
<<<<<<< HEAD
	return `${prefix || ""}${uuid()}`;
}

export function validateUUID(id: string) {
	return validate(id);
=======
	return `${prefix || ""}${globalThis.crypto.randomUUID()}`;
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
}
