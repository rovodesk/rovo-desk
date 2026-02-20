// hmac.ts
import { createHmac, randomBytes } from "crypto";
import { fromBase58, safeCompareBase58, toBase58 } from "./encoding";

interface IHMACCrypto {
	generateSecret(): string;
	sign(secret: string, payload: string): string;
	verify(
		secret: string,
		payload: string,
		timestamp: string,
		signature: string,
		toleranceSeconds?: number
	): boolean;
}

export class HmacCrypto implements IHMACCrypto {
	private readonly WEBHOOK_PREFIX = "zh_whsec_";

	generateSecret(): string {
		return this.WEBHOOK_PREFIX + toBase58(randomBytes(32));
	}

	sign(secret: string, payload: string): string {
		this.assertPrefix(secret);

		const rawSecret = fromBase58(secret.slice(this.WEBHOOK_PREFIX.length));

		const timestamp = Math.floor(Date.now() / 1000).toString();

		const base = `${timestamp}.${payload}`;

		const signature = createHmac("sha256", rawSecret).update(base).digest();

		return toBase58(signature);
	}

	verify(
		secret: string,
		payload: string,
		timestamp: string,
		signature: string,
		toleranceSeconds = 300
	): boolean {
		this.assertPrefix(secret);

		// Replay protection
		const now = Math.floor(Date.now() / 1000);
		const ts = Number(timestamp);

		if (!ts || Math.abs(now - ts) > toleranceSeconds) {
			return false;
		}

		const expected = this.sign(secret, payload);

		return safeCompareBase58(expected, signature);
	}

	private assertPrefix(secret: string) {
		if (!secret.startsWith(this.WEBHOOK_PREFIX)) {
			throw new Error("Invalid webhook secret");
		}
	}
}
