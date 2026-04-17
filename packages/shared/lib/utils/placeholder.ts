import { friendlyWords } from "friendlier-words";
import { generateUUID } from "./id.js";

export class Placeholder {
	static avatar(email?: string) {
		return `https://api.dicebear.com/9.x/avataaars/svg?seed=${email || generateUUID()}`;
	}

	static logo(name?: string, variant: "glass" | "shapes" = "glass") {
		return `https://api.dicebear.com/9.x/${variant}/svg?seed=${name || generateUUID()}`;
	}

	static name(segments = 2, separator = " ") {
		return friendlyWords(segments, separator);
	}

	static slug(words = 3, separator = "-", suffixLength = 4) {
		let value: number;

		if (typeof globalThis.crypto?.getRandomValues === "function") {
			const array = new Uint32Array(1);
			globalThis.crypto.getRandomValues(array);
			value = array[0] ?? Math.floor(Math.random() * 0xff_ff_ff_ff);
		} else {
			value = Math.floor(Math.random() * 0xff_ff_ff_ff);
		}

		if (value === undefined) throw new Error("Failed to generate random value");

		const suffix = value.toString(36).slice(0, suffixLength);

		return `${friendlyWords(words, separator)}-${suffix}`;
	}
}
