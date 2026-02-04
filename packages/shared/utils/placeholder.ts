import { friendlyWords } from "friendlier-words";
import { generateUUID } from "./uuid";

// biome-ignore lint/complexity/noStaticOnlyClass: It is necessary
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
		const [value] = globalThis.crypto.getRandomValues(new Uint32Array(1));

		if (!value) throw new Error("Failed to generate random value");

		const suffix = value.toString(36).slice(0, suffixLength);

		return `${friendlyWords(words, separator)}-${suffix}`;
	}
}
