export type StoragePutBody =
	| string
	| ArrayBuffer
	| ArrayBufferView
	| Blob
	| ReadableStream
	| File;

export interface StoragePutOptions {
	httpMetadata?: R2HTTPMetadata;
	customMetadata?: Record<string, string>;
	sha256?: string;
}

export interface StoragePutResult {
	key: string;
	version?: string;
	etag?: string;
	uploadedAt?: Date;
}

export interface StorageObject {
	key: string;
	version?: string;
	etag?: string;
	size?: number;
	uploadedAt?: Date;
	httpMetadata?: R2HTTPMetadata;
	customMetadata?: Record<string, string>;
	body: R2ObjectBody;
}

export interface StorageHeadObject {
	key: string;
	version?: string;
	etag?: string;
	size?: number;
	uploadedAt?: Date;
	httpMetadata?: R2HTTPMetadata;
	customMetadata?: Record<string, string>;
}

export interface StorageListOptions {
	limit?: number;
	cursor?: string;
	delimiter?: string;
}

export interface StorageListResult {
	objects: StorageHeadObject[];
	truncated: boolean;
	cursor?: string;
	delimitedPrefixes?: string[];
}

export interface StorageMultipartOptions {
	httpMetadata?: R2HTTPMetadata;
	customMetadata?: Record<string, string>;
}

export interface StorageMultipartUpload {
	key: string;
	uploadId: string;
	uploadPart(
		partNumber: number,
		body: Exclude<StoragePutBody, ReadableStream>
	): Promise<R2UploadedPart>;
	complete(parts: R2UploadedPart[]): Promise<R2Object>;
	abort(): Promise<void>;
}
