import bs58 from "bs58";
import { timingSafeEqual } from "crypto";

export function toBase58(buffer: Buffer): string {
	return bs58.encode(buffer);
}

export function fromBase58(value: string): Buffer {
	return Buffer.from(bs58.decode(value));
}

export function safeCompareBase58(a: string, b: string): boolean {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);

	if (bufA.length !== bufB.length) return false;

	return timingSafeEqual(bufA, bufB);
}
