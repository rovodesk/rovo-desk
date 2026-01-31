export interface ICacheStore {
	get<T = unknown>(key: string): Promise<T | null>;
	set(key: string, value: unknown, ttl?: number): Promise<void>;
	delete(key: string): Promise<void>;
	close(): void;
}
