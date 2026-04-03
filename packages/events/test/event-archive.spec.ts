import { MockStorageService } from "@zero-heads-lab/storage/mock";
import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import type { BaseEvent } from "../lib";
import { EventArchive } from "../lib/archive";

describe("EventArchive", () => {
	let storage: MockStorageService;
	let archive: EventArchive;

	const storageHeadObjectSchema = z.object({
		key: z.string(),
		version: z.string().optional(),
		etag: z.string().optional(),
		size: z.number().optional(),
		uploadedAt: z.date().optional(),
		httpMetadata: z.any().optional(),
		customMetadata: z.record(z.string(), z.string()).optional(),
	});

	const storageObjectSchema = storageHeadObjectSchema.extend({
		body: z.any(),
	});

	const baseEvent: BaseEvent = {
		eventId: "evt_123",
		type: "auth.user.created",
		category: "auth",
		source: "auth-service",
		subject: "user:user_123",
		schemaVersion: 1,
		occurredAt: new Date("2026-04-03T10:15:30.000Z"),
		receivedAt: new Date("2026-04-03T10:15:31.000Z"),
		tenantId: "tenant_123",
		payload: {
			userId: "user_123",
			email: "test@example.com",
		},
	};

	beforeEach(() => {
		storage = new MockStorageService();
		archive = new EventArchive(storage, { environment: "production" });
	});

	it("archives an event and returns the archive path", async () => {
		const result = await archive.archiveEvent(baseEvent);

		expect(result.path).toBe(
			"production/auth/auth.user.created/2026/04/03/evt_123.json"
		);

		expect(result.event).toEqual(baseEvent);

		const exists = await storage.exists(result.path);
		expect(exists).toBe(true);
	});

	it("writes the archived event as JSON", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		const stored = await storage.getObjectJson<BaseEvent>(path);

		expect(stored).toEqual({
			...baseEvent,
			occurredAt: baseEvent.occurredAt.toISOString(),
			receivedAt: baseEvent.receivedAt.toISOString(),
		});
	});

	it("reads an archived event and validates it", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		const result = await archive.readArchivedEvent(path);

		expect(result).toEqual(baseEvent);
		expect(result.occurredAt).toBeInstanceOf(Date);
		expect(result.receivedAt).toBeInstanceOf(Date);
	});

	it("reads an archived event as raw text", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		const text = await archive.readArchivedEventText(path);

		expect(typeof text).toBe("string");
		expect(text).toContain('"eventId": "evt_123"');
		expect(text).toContain('"type": "auth.user.created"');
	});

	it("reads an archived event as object", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		const object = await archive.readArchivedEventObject(
			path,
			storageObjectSchema
		);

		expect(object.key).toBe(path);
		expect(object.size).toBeGreaterThan(0);
		expect(object.customMetadata).toMatchObject({
			category: "auth",
			type: "auth.user.created",
			source: "auth-service",
			subject: "user:user_123",
			schemaVersion: "1",
			eventId: "evt_123",
		});
	});

	it("returns metadata with headArchivedEvent", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		const head = await archive.headArchivedEvent(path, storageHeadObjectSchema);

		expect(head.key).toBe(path);
		expect(head.size).toBeGreaterThan(0);
		expect(head.customMetadata).toMatchObject({
			category: "auth",
			type: "auth.user.created",
			eventId: "evt_123",
		});
	});

	it("checks if an archived event exists", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		await expect(archive.exists(path)).resolves.toBe(true);
		await expect(
			archive.exists(
				"production/auth/auth.user.created/2026/04/03/missing.json"
			)
		).resolves.toBe(false);
	});

	it("lists archived events by prefix", async () => {
		await archive.archiveEvent(baseEvent);

		await archive.archiveEvent({
			...baseEvent,
			eventId: "evt_456",
			subject: "user:user_456",
			payload: {
				userId: "user_456",
				email: "another@example.com",
			},
		});

		const result = await archive.listArchivedEvents(
			storageHeadObjectSchema,
			"production/auth/auth.user.created/"
		);

		expect(result).toHaveLength(2);
		expect(result.map((o) => o.key)).toEqual([
			"production/auth/auth.user.created/2026/04/03/evt_123.json",
			"production/auth/auth.user.created/2026/04/03/evt_456.json",
		]);
	});

	it("deletes an archived event", async () => {
		const { path } = await archive.archiveEvent(baseEvent);

		await archive.deleteArchivedEvent(path);

		await expect(archive.exists(path)).resolves.toBe(false);
	});

	it("throws when reading a missing archived event as JSON", async () => {
		await expect(
			archive.readArchivedEvent(
				"production/auth/auth.user.created/2026/04/03/missing.json"
			)
		).rejects.toThrow("Archived event not found");
	});

	it("throws when reading a missing archived event as text", async () => {
		await expect(
			archive.readArchivedEventText(
				"production/auth/auth.user.created/2026/04/03/missing.json"
			)
		).rejects.toThrow("Archived event not found");
	});

	it("throws when reading a missing archived event as object", async () => {
		await expect(
			archive.readArchivedEventObject(
				"production/auth/auth.user.created/2026/04/03/missing.json",
				storageObjectSchema
			)
		).rejects.toThrow("Archived event not found");
	});

	it("throws when reading head for a missing archived event", async () => {
		await expect(
			archive.headArchivedEvent(
				"production/auth/auth.user.created/2026/04/03/missing.json",
				storageHeadObjectSchema
			)
		).rejects.toThrow("Archived event not found");
	});

	it("validates the event before archiving", async () => {
		const invalidEvent = {
			...baseEvent,
			eventId: "",
		} as BaseEvent;

		await expect(archive.archiveEvent(invalidEvent)).rejects.toThrow();
	});

	it("throws when archived JSON is invalid against the schema", async () => {
		const invalidPath = "production/auth/auth.user.created/2026/04/03/bad.json";

		await storage.putJson(invalidPath, {
			foo: "bar",
		});

		await expect(archive.readArchivedEvent(invalidPath)).rejects.toThrow();
	});
});
