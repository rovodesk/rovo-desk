/** biome-ignore-all lint/suspicious/useAwait: No await needed */
import type { IStorageService } from "@zero-heads-lab/storage";
import type { z } from "zod";
import { type BaseEvent, baseEventSchema } from "./base";

export interface EventArchiveOptions {
	/**
	 * Optional environment prefix such as:
	 * - production
	 * - staging
	 * - development
	 */
	environment?: string;
}

export interface ArchiveEventResult {
	path: string;
	alreadyExisted: boolean;
}

export interface IEventArchive {
	archiveEvent(event: BaseEvent): Promise<ArchiveEventResult>;
	exists(path: string): Promise<boolean>;
	deleteArchivedEvent(path: string): Promise<void>;
	determinePath(event: BaseEvent): string;
	readArchivedEvent(path: string): Promise<BaseEvent>;
	readArchivedEventText(path: string): Promise<string>;
	readArchivedEventObject<T>(path: string, schema: z.ZodType<T>): Promise<T>;
	headArchivedEvent<T>(path: string, schema: z.ZodType<T>): Promise<T>;
	listArchivedEvents<T>(schema: z.ZodType<T>, prefix?: string): Promise<T[]>;
}

export class EventArchive implements IEventArchive {
	private readonly storage: IStorageService;
	private readonly environment?: string;

	constructor(storage: IStorageService, options?: EventArchiveOptions) {
		this.storage = storage;
		this.environment = options?.environment;
	}

	determinePath(event: BaseEvent): string {
		const { category, source, subject, occurredAt, eventId } = event;

		const date = new Date(occurredAt);
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const day = String(date.getUTCDate()).padStart(2, "0");

		const basePath = `${category}/${source}/${subject}/${year}/${month}/${day}/${eventId}.json`;

		return this.environment ? `${this.environment}/${basePath}` : basePath;
	}

	async archiveEvent(event: BaseEvent): Promise<ArchiveEventResult> {
		const validatedEvent = baseEventSchema.parse(event);
		const path = this.determinePath(validatedEvent);

		const existingEvent = await this.exists(path);
		if (existingEvent) {
			return {
				path,
				alreadyExisted: true,
			};
		}

		await this.storage.putJson<BaseEvent>(path, validatedEvent, {
			customMetadata: {
				category: validatedEvent.category,
				type: validatedEvent.type,
				source: validatedEvent.source,
				subject: validatedEvent.subject,
				schemaVersion: String(validatedEvent.schemaVersion),
				eventId: validatedEvent.eventId,
			},
		});
		const head = await this.storage.headObject(path);
		if (!head) {
			throw new Error(`Archive verification failed: ${path}`);
		}

		return {
			path,
			alreadyExisted: false,
		};
	}

	async exists(path: string): Promise<boolean> {
		return this.storage.exists(path);
	}

	async deleteArchivedEvent(path: string): Promise<void> {
		await this.storage.deleteObject(path);
	}

	async readArchivedEvent(path: string): Promise<BaseEvent> {
		const event = await this.storage.getObjectJson<BaseEvent>(path);

		if (!event) {
			throw new Error(`Archived event not found: ${path}`);
		}

		return baseEventSchema.parse(event);
	}

	async readArchivedEventText(path: string): Promise<string> {
		const text = await this.storage.getObjectText(path);

		if (!text) {
			throw new Error(`Archived event not found: ${path}`);
		}

		return text;
	}

	async readArchivedEventObject<T>(
		path: string,
		schema: z.ZodType<T>
	): Promise<T> {
		const object = await this.storage.getObject(path);

		if (!object) {
			throw new Error(`Archived event not found: ${path}`);
		}

		return schema.parse(object);
	}

	async headArchivedEvent<T>(path: string, schema: z.ZodType<T>): Promise<T> {
		const object = await this.storage.headObject(path);

		if (!object) {
			throw new Error(`Archived event not found: ${path}`);
		}

		return schema.parse(object);
	}

	async listArchivedEvents<T>(
		schema: z.ZodType<T>,
		prefix?: string
	): Promise<T[]> {
		const result = await this.storage.listObjects(prefix);

		return result.objects.map((object) => schema.parse(object));
	}
}
