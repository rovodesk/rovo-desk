import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { eq, sql } from "drizzle-orm";
import { stripeWebhookEvent } from "../../../lib/schemas/billing.schema";
import type {
	CreateWebhookEventInput,
	IWebhookEventRepository,
	WebhookEvent,
} from "./webhook.types";

export class WebhookEventRepository implements IWebhookEventRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async getById(params: { id: string }): Promise<WebhookEvent | null> {
		return await this.tracer.withSpan("webhook.getById", async () => {
			const event = await this.db.query.stripeWebhookEvent.findFirst({
				where: eq(stripeWebhookEvent.id, params.id),
			});
			return event ?? null;
		});
	}

	async createIfNotExists(input: CreateWebhookEventInput): Promise<void> {
		await this.tracer.withSpan("webhook.createIfNotExists", async () => {
			const existing = await this.getById({ id: input.id });
			if (existing) return;

			await this.db.insert(stripeWebhookEvent).values({
				id: input.id,
				type: input.type,
				apiVersion: input.apiVersion ?? null,
				account: input.account ?? null,
				objectId: input.objectId ?? null,
				payload: input.payload,
				status: "received",
			});
		});
	}

	async markProcessing(params: { id: string }): Promise<void> {
		await this.tracer.withSpan("webhook.markProcessing", async () => {
			await this.db
				.update(stripeWebhookEvent)
				.set({
					status: "processing",
					attempts: "1",
				})
				.where(eq(stripeWebhookEvent.id, params.id))
				.returning();
		});
	}

	async incrementAttempt(params: { id: string }): Promise<void> {
		await this.tracer.withSpan("webhook.incrementAttempt", async () => {
			await this.db
				.update(stripeWebhookEvent)
				.set({
					attempts: sql`${stripeWebhookEvent.attempts}::int + 1`,
				})
				.where(eq(stripeWebhookEvent.id, params.id));
		});
	}

	async markProcessed(params: { id: string }): Promise<void> {
		await this.tracer.withSpan("webhook.markProcessed", async () => {
			await this.db
				.update(stripeWebhookEvent)
				.set({
					status: "processed",
					processedAt: new Date(),
				})
				.where(eq(stripeWebhookEvent.id, params.id));
		});
	}

	async markIgnored(params: { id: string; error?: unknown }): Promise<void> {
		await this.tracer.withSpan("webhook.markIgnored", async () => {
			await this.db
				.update(stripeWebhookEvent)
				.set({
					status: "ignored",
					processedAt: new Date(),
					error:
						params.error && params.error instanceof Error
							? params.error.message
							: String(params.error),
				})
				.where(eq(stripeWebhookEvent.id, params.id));
		});
	}

	async markFailed(params: { id: string; error: unknown }): Promise<void> {
		await this.tracer.withSpan("webhook.markFailed", async () => {
			await this.db
				.update(stripeWebhookEvent)
				.set({
					status: "failed",
					error:
						params.error instanceof Error
							? params.error.message
							: String(params.error),
				})
				.where(eq(stripeWebhookEvent.id, params.id));
		});
	}
}
