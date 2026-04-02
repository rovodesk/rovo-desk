import { decodeWebhook, type WebhookEvent } from "@kinde/webhooks";

export async function verifyKindeWebhook(
	token: string,
	domain: string
): Promise<WebhookEvent | null> {
	return await decodeWebhook(token, domain);
}
