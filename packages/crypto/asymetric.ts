// asymmetric.ts
import {
	createPrivateKey,
	createPublicKey,
	generateKeyPairSync,
	sign,
	verify,
} from "crypto";
import { fromBase58, toBase58 } from "./encoding";

export interface KeyPair {
	publicKey: string;
	privateKey: string;
}

export class AsymmetricCrypto {
	private readonly PUBLIC_PREFIX = "zh_pk_";
	private readonly PRIVATE_PREFIX = "zh_sk_";

	generateKeyPair(): KeyPair {
		const { publicKey, privateKey } = generateKeyPairSync("ed25519");

		// Export raw key material directly
		const rawPublic = publicKey
			.export({ format: "der", type: "spki" })
			.subarray(-32);
		const rawPrivate = privateKey
			.export({ format: "der", type: "pkcs8" })
			.subarray(-32);

		if (rawPublic.length !== 32 || rawPrivate.length !== 32) {
			throw new Error("Invalid key extraction");
		}

		return {
			publicKey: `zh_pk_${toBase58(rawPublic)}`,
			privateKey: `zh_sk_${toBase58(rawPrivate)}`,
		};
	}
	sign(privateKey: string, message: string): string {
		this.assertPrefix(privateKey, this.PRIVATE_PREFIX);

		const rawKey = fromBase58(privateKey.slice(this.PRIVATE_PREFIX.length));

		const keyObject = createPrivateKey({
			key: rawKey,
			format: "der",
			type: "pkcs8",
		});

		const signature = sign(null, Buffer.from(message), keyObject);

		return toBase58(signature);
	}

	verify(publicKey: string, message: string, signature: string): boolean {
		this.assertPrefix(publicKey, this.PUBLIC_PREFIX);

		const rawKey = fromBase58(publicKey.slice(this.PUBLIC_PREFIX.length));

		const keyObject = createPublicKey({
			key: rawKey,
			format: "der",
			type: "spki",
		});

		return verify(null, Buffer.from(message), keyObject, fromBase58(signature));
	}

	private assertPrefix(value: string, prefix: string) {
		if (!value.startsWith(prefix)) {
			throw new Error("Invalid key prefix");
		}
	}
}
