import type {
	StorageHeadObject,
	StorageListOptions,
	StorageListResult,
	StorageMultipartOptions,
	StorageMultipartUpload,
	StorageObject,
	StoragePutBody,
	StoragePutOptions,
	StoragePutResult,
} from "./types";

export interface IStorageService {
	putObject(
		path: string,
		body: StoragePutBody,
		options?: StoragePutOptions
	): Promise<StoragePutResult>;

	putJson<T>(
		path: string,
		data: T,
		options?: Omit<StoragePutOptions, "httpMetadata">
	): Promise<StoragePutResult>;

	getObject(path: string): Promise<StorageObject | null>;
	getObjectText(path: string): Promise<string | null>;
	getObjectJson<T = unknown>(path: string): Promise<T | null>;

	exists(path: string): Promise<boolean>;

	deleteObject(path: string): Promise<void>;
	headObject(path: string): Promise<StorageHeadObject | null>;

	listObjects(
		prefix?: string,
		options?: StorageListOptions
	): Promise<StorageListResult>;

	createMultipartUpload(
		path: string,
		options?: StorageMultipartOptions
	): Promise<StorageMultipartUpload>;
	resumeMultipartUpload(
		path: string,
		uploadId: string
	): Promise<StorageMultipartUpload>;
}

export class StorageService implements IStorageService {
	private readonly r2: R2Bucket;

	constructor(r2: R2Bucket) {
		this.r2 = r2;
	}

	async putObject(
		path: string,
		body: StoragePutBody,
		options?: StoragePutOptions
	): Promise<StoragePutResult> {
		const result = await this.r2.put(path, body, {
			httpMetadata: options?.httpMetadata,
			customMetadata: options?.customMetadata,
			sha256: options?.sha256,
		});

		return {
			key: result.key,
			version: result.version,
			etag: result.etag,
			uploadedAt: result.uploaded,
		};
	}

	// biome-ignore lint/suspicious/useAwait: No await needed
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
		const object = await this.r2.get(path);

		if (!object) return null;

		return {
			key: object.key,
			version: object.version,
			etag: object.etag,
			size: object.size,
			uploadedAt: object.uploaded,
			httpMetadata: object.httpMetadata,
			customMetadata: object.customMetadata,
			body: object,
		};
	}

	async getObjectText(path: string): Promise<string | null> {
		const object = await this.r2.get(path);

		if (!object) return null;

		return await object.text();
	}

	async getObjectJson<T = unknown>(path: string): Promise<T | null> {
		const object = await this.r2.get(path);

		if (!object) return null;

		return (await object.json()) as T;
	}

	async deleteObject(path: string): Promise<void> {
		await this.r2.delete(path);
	}

	async headObject(path: string): Promise<StorageHeadObject | null> {
		const object = await this.r2.head(path);

		if (!object) return null;

		return {
			key: object.key,
			version: object.version,
			etag: object.etag,
			size: object.size,
			uploadedAt: object.uploaded,
			httpMetadata: object.httpMetadata,
			customMetadata: object.customMetadata,
		};
	}

	async listObjects(
		prefix?: string,
		options?: StorageListOptions
	): Promise<StorageListResult> {
		const result = await this.r2.list({
			prefix,
			limit: options?.limit,
			delimiter: options?.delimiter,
		});

		return {
			objects: result.objects.map((object) => ({
				key: object.key,
				version: object.version,
				etag: object.etag,
				size: object.size,
				uploadedAt: object.uploaded,
				httpMetadata: object.httpMetadata,
				customMetadata: object.customMetadata,
			})),
			truncated: result.truncated,
			delimitedPrefixes: result.delimitedPrefixes,
		};
	}

	async createMultipartUpload(
		path: string,
		options?: StorageMultipartOptions
	): Promise<StorageMultipartUpload> {
		const upload = await this.r2.createMultipartUpload(path, {
			httpMetadata: options?.httpMetadata,
			customMetadata: options?.customMetadata,
		});

		return {
			key: upload.key,
			uploadId: upload.uploadId,
			uploadPart: upload.uploadPart.bind(upload),
			complete: upload.complete.bind(upload),
			abort: upload.abort.bind(upload),
		};
	}

	async exists(path: string): Promise<boolean> {
		const object = await this.r2.head(path);
		return !!object;
	}

	// biome-ignore lint/suspicious/useAwait:No await needed
	async resumeMultipartUpload(
		path: string,
		uploadId: string
	): Promise<StorageMultipartUpload> {
		const upload = this.r2.resumeMultipartUpload(path, uploadId);

		return {
			key: upload.key,
			uploadId: upload.uploadId,
			uploadPart: upload.uploadPart.bind(upload),
			complete: upload.complete.bind(upload),
			abort: upload.abort.bind(upload),
		};
	}
}
