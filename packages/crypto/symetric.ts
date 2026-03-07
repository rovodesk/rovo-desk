import { createHmac, randomBytes } from "crypto";
import { fromBase58, safeCompareBase58, toBase58 } from "./encoding";

interface IHMACCrypto {
	generateSecret(): string;
	sign(
		secret: string,
		payload: string
	): {
		timestamp: string;
		signature: string;
	};
	verify(
		secret: string,
		payload: string,
		timestamp: string,
		signature: string,
		toleranceSeconds?: number
	): boolean;
}

export class HmacCrypto implements IHMACCrypto {
	private readonly PREFIX = "zh_whsec_";

	generateSecret(): string {
		return this.PREFIX + toBase58(randomBytes(32));
	}

	sign(secret: string, payload: string) {
		this.assertPrefix(secret);

		const rawSecret = fromBase58(secret.slice(this.PREFIX.length));

		const timestamp = Math.floor(Date.now() / 1000).toString();
		const base = `${timestamp}.${payload}`;

		const signature = createHmac("sha256", rawSecret).update(base).digest();

		return {
			timestamp,
			signature: toBase58(signature),
		};
	}

	verify(
		secret: string,
		payload: string,
		timestamp: string,
		signature: string,
		toleranceSeconds = 60 // tighter for widget auth
	): boolean {
		this.assertPrefix(secret);

		const ts = Number(timestamp);
		if (!ts) return false;

		const now = Math.floor(Date.now() / 1000);
		if (Math.abs(now - ts) > toleranceSeconds) {
			return false;
		}

		const rawSecret = fromBase58(secret.slice(this.PREFIX.length));
		const base = `${timestamp}.${payload}`;

		const expected = createHmac("sha256", rawSecret).update(base).digest();

		return safeCompareBase58(toBase58(expected), signature);
	}

	private assertPrefix(secret: string) {
		if (!secret.startsWith(this.PREFIX)) {
			throw new Error("Invalid secret format");
		}
	}
}

const hmac = new HmacCrypto();

export function generateTenantSignature(
	tenantId: string,
	userId: string,
	connectionSecret: string
) {
	const payload = `${tenantId}:${userId}`;

	return hmac.sign(connectionSecret, payload);
}

export function verifyTenantHMACSignature(
	tenantId: string,
	userId: string,
	timestamp: string,
	signature: string,
	connectionSecret: string
): boolean {
	const payload = `${tenantId}:${userId}`;

	return hmac.verify(
		connectionSecret,
		payload,
		timestamp,
		signature,
		60 // 60-second replay window
	);
}
