import {
	createPrivateKey,
	createPublicKey,
	generateKeyPairSync,
	sign,
	verify,
} from "crypto";
import { fromBase58, toBase58 } from "encoding";

export interface KeyPair {
	publicKey: string;
	privateKey: string;
}

export class AsymmetricCrypto {
	private readonly PUBLIC_PREFIX = "zh_pk_";
	private readonly PRIVATE_PREFIX = "zh_sk_";

	generateKeyPair(): KeyPair {
		const { publicKey, privateKey } = generateKeyPairSync("ed25519", {
			publicKeyEncoding: {
				format: "der",
				type: "spki",
			},
			privateKeyEncoding: {
				format: "der",
				type: "pkcs8",
			},
		});

		return {
			publicKey: this.PUBLIC_PREFIX + toBase58(publicKey),
			privateKey: this.PRIVATE_PREFIX + toBase58(privateKey),
		};
	}

	sign(privateKey: string, message: string): string {
		this.assertPrefix(privateKey, this.PRIVATE_PREFIX);

		const keyBuffer = Buffer.from(
			fromBase58(privateKey.slice(this.PRIVATE_PREFIX.length))
		);

		const keyObject = createPrivateKey({
			key: keyBuffer,
			format: "der",
			type: "pkcs8",
		});

		const signature = sign(null, Buffer.from(message), keyObject);

		return toBase58(signature);
	}

	verify(publicKey: string, payload: string, signature: string): boolean {
		this.assertPrefix(publicKey, this.PUBLIC_PREFIX);

		const keyBuffer = Buffer.from(
			fromBase58(publicKey.slice(this.PUBLIC_PREFIX.length))
		);

		const keyObject = createPublicKey({
			key: keyBuffer,
			format: "der",
			type: "spki",
		});

		return verify(
			null,
			Buffer.from(payload),
			keyObject,
			Buffer.from(fromBase58(signature))
		);
	}

	private assertPrefix(value: string, prefix: string) {
		if (!value.startsWith(prefix)) {
			throw new Error("Invalid key prefix");
		}
	}
}
