/** biome-ignore-all lint/suspicious/useAwait: No await needed */
import type {
	IStorageService,
	StorageHeadObject,
	StorageListOptions,
	StorageListResult,
	StorageMultipartOptions,
	StorageMultipartUpload,
	StorageObject,
	StoragePutBody,
	StoragePutOptions,
	StoragePutResult,
} from ".";

type StoredRecord = {
	key: string;
	body: Uint8Array;
	text: string;
	version: string;
	etag: string;
	uploadedAt: Date;
	httpMetadata?: R2HTTPMetadata;
	customMetadata?: Record<string, string>;
};

type MultipartSession = {
	key: string;
	uploadId: string;
	httpMetadata?: R2HTTPMetadata;
	customMetadata?: Record<string, string>;
	parts: Map<number, Uint8Array>;
	aborted: boolean;
};

function randomId(prefix = "mock"): string {
	return `${prefix}_${crypto.randomUUID()}`;
}

function toUint8Array(body: StoragePutBody): Promise<Uint8Array> | Uint8Array {
	if (typeof body === "string") {
		return new TextEncoder().encode(body);
	}

	if (body instanceof ArrayBuffer) {
		return new Uint8Array(body);
	}

	if (ArrayBuffer.isView(body)) {
		return new Uint8Array(
			body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength)
		);
	}

	if (body instanceof Blob) {
		return body.arrayBuffer().then((ab) => new Uint8Array(ab));
	}

	if (body instanceof ReadableStream) {
		return new Response(body).arrayBuffer().then((ab) => new Uint8Array(ab));
	}

	return new Uint8Array();
}

function uint8ToText(bytes: Uint8Array): string {
	return new TextDecoder().decode(bytes);
}

function makeStorageHead(record: StoredRecord): StorageHeadObject {
	return {
		key: record.key,
		version: record.version,
		etag: record.etag,
		size: record.body.byteLength,
		uploadedAt: record.uploadedAt,
		httpMetadata: record.httpMetadata,
		customMetadata: record.customMetadata,
	};
}

function makeStorageObject(record: StoredRecord): StorageObject {
	const blobBuffer = record.body.buffer.slice(
		record.body.byteOffset,
		record.body.byteOffset + record.body.byteLength
	) as ArrayBuffer;

	const blob = new Blob([blobBuffer], {
		type: record.httpMetadata?.contentType,
	});

	const body = {
		key: record.key,
		version: record.version,
		etag: record.etag,
		size: record.body.byteLength,
		uploaded: record.uploadedAt,
		httpMetadata: record.httpMetadata,
		customMetadata: record.customMetadata,
		body: blob.stream(),
		bodyUsed: false,
		arrayBuffer: async () =>
			record.body.buffer.slice(
				record.body.byteOffset,
				record.body.byteOffset + record.body.byteLength
			),
		text: async () => record.text,
		json: async <T>() => JSON.parse(record.text) as T,
		blob: async () => blob,
	} as unknown as R2ObjectBody;

	return {
		key: record.key,
		version: record.version,
		etag: record.etag,
		size: record.body.byteLength,
		uploadedAt: record.uploadedAt,
		httpMetadata: record.httpMetadata,
		customMetadata: record.customMetadata,
		body,
	};
}

export class MockStorageService implements IStorageService {
	private readonly objects = new Map<string, StoredRecord>();
	private readonly multipartUploads = new Map<string, MultipartSession>();

	async putObject(
		path: string,
		body: StoragePutBody,
		options?: StoragePutOptions
	): Promise<StoragePutResult> {
		const bytes = await toUint8Array(body);
		const uploadedAt = new Date();

		const record: StoredRecord = {
			key: path,
			body: bytes,
			text: uint8ToText(bytes),
			version: randomId("ver"),
			etag: randomId("etag"),
			uploadedAt,
			httpMetadata: options?.httpMetadata,
			customMetadata: options?.customMetadata,
		};

		this.objects.set(path, record);

		return {
			key: record.key,
			version: record.version,
			etag: record.etag,
			uploadedAt: record.uploadedAt,
		};
	}

	async putJson<T>(
		path: string,
		data: T,
		options?: Omit<StoragePutOptions, "httpMetadata">
	): Promise<StoragePutResult> {
		return this.putObject(path, JSON.stringify(data, null, 2), {
			...options,
			httpMetadata: {
				contentType: "application/json",
			},
		});
	}

	async getObject(path: string): Promise<StorageObject | null> {
		const record = this.objects.get(path);
		if (!record) return null;
		return makeStorageObject(record);
	}

	async getObjectText(path: string): Promise<string | null> {
		const record = this.objects.get(path);
		return record ? record.text : null;
	}

	async getObjectJson<T = unknown>(path: string): Promise<T | null> {
		const record = this.objects.get(path);
		if (!record) return null;
		return JSON.parse(record.text) as T;
	}

	async exists(path: string): Promise<boolean> {
		return this.objects.has(path);
	}

	async deleteObject(path: string): Promise<void> {
		this.objects.delete(path);
	}

	async headObject(path: string): Promise<StorageHeadObject | null> {
		const record = this.objects.get(path);
		if (!record) return null;
		return makeStorageHead(record);
	}

	async listObjects(
		prefix?: string,
		options?: StorageListOptions
	): Promise<StorageListResult> {
		const filtered = [...this.objects.values()]
			.filter((record) => (prefix ? record.key.startsWith(prefix) : true))
			.sort((a, b) => a.key.localeCompare(b.key));

		const limited =
			typeof options?.limit === "number"
				? filtered.slice(0, options.limit)
				: filtered;

		let delimitedPrefixes: string[] | undefined;

		if (options?.delimiter) {
			const prefixes = new Set<string>();

			for (const record of limited) {
				const suffix = prefix ? record.key.slice(prefix.length) : record.key;
				const idx = suffix.indexOf(options.delimiter);

				if (idx >= 0) {
					const base = (prefix ?? "") + suffix.slice(0, idx + 1);
					prefixes.add(base);
				}
			}

			delimitedPrefixes = [...prefixes].sort();
		}

		return {
			objects: limited.map(makeStorageHead),
			truncated:
				typeof options?.limit === "number" && filtered.length > options.limit,
			cursor: undefined,
			delimitedPrefixes,
		};
	}

	async createMultipartUpload(
		path: string,
		options?: StorageMultipartOptions
	): Promise<StorageMultipartUpload> {
		const uploadId = randomId("upload");

		const session: MultipartSession = {
			key: path,
			uploadId,
			httpMetadata: options?.httpMetadata,
			customMetadata: options?.customMetadata,
			parts: new Map(),
			aborted: false,
		};

		this.multipartUploads.set(uploadId, session);

		return this.makeMultipartUpload(session);
	}

	async resumeMultipartUpload(
		path: string,
		uploadId: string
	): Promise<StorageMultipartUpload> {
		const session = this.multipartUploads.get(uploadId);

		if (!session || session.key !== path) {
			throw new Error(
				`Multipart upload not found for path="${path}" uploadId="${uploadId}"`
			);
		}

		if (session.aborted) {
			throw new Error(
				`Multipart upload "${uploadId}" has already been aborted`
			);
		}

		return this.makeMultipartUpload(session);
	}

	clear(): void {
		this.objects.clear();
		this.multipartUploads.clear();
	}

	seedObject(
		path: string,
		value: string | object,
		options?: {
			httpMetadata?: R2HTTPMetadata;
			customMetadata?: Record<string, string>;
		}
	): void {
		const text =
			typeof value === "string" ? value : JSON.stringify(value, null, 2);
		const body = new TextEncoder().encode(text);

		this.objects.set(path, {
			key: path,
			body,
			text,
			version: randomId("ver"),
			etag: randomId("etag"),
			uploadedAt: new Date(),
			httpMetadata: options?.httpMetadata,
			customMetadata: options?.customMetadata,
		});
	}

	private makeMultipartUpload(
		session: MultipartSession
	): StorageMultipartUpload {
		return {
			key: session.key,
			uploadId: session.uploadId,

			uploadPart: async (
				partNumber: number,
				body: Exclude<StoragePutBody, ReadableStream>
			) => {
				if (session.aborted) {
					throw new Error(
						`Multipart upload "${session.uploadId}" has been aborted`
					);
				}

				const bytes = await toUint8Array(body);
				session.parts.set(partNumber, bytes);

				return {
					partNumber,
					etag: randomId("etag"),
				} as R2UploadedPart;
			},

			complete: async (parts: R2UploadedPart[]) => {
				if (session.aborted) {
					throw new Error(
						`Multipart upload "${session.uploadId}" has been aborted`
					);
				}

				const ordered = [...parts]
					.sort((a, b) => a.partNumber - b.partNumber)
					.map((part) => {
						const chunk = session.parts.get(part.partNumber);
						if (!chunk) {
							throw new Error(`Missing uploaded part ${part.partNumber}`);
						}
						return chunk;
					});

				const totalSize = ordered.reduce(
					(sum, chunk) => sum + chunk.byteLength,
					0
				);
				const combined = new Uint8Array(totalSize);

				let offset = 0;
				for (const chunk of ordered) {
					combined.set(chunk, offset);
					offset += chunk.byteLength;
				}

				const uploadedAt = new Date();
				const record: StoredRecord = {
					key: session.key,
					body: combined,
					text: uint8ToText(combined),
					version: randomId("ver"),
					etag: randomId("etag"),
					uploadedAt,
					httpMetadata: session.httpMetadata,
					customMetadata: session.customMetadata,
				};

				this.objects.set(session.key, record);
				this.multipartUploads.delete(session.uploadId);

				return {
					key: record.key,
					version: record.version,
					etag: record.etag,
					size: record.body.byteLength,
					uploaded: record.uploadedAt,
					httpMetadata: record.httpMetadata,
					customMetadata: record.customMetadata,
					checksums: {},
				} as R2Object;
			},

			abort: async () => {
				session.aborted = true;
				this.multipartUploads.delete(session.uploadId);
			},
		};
	}
}
