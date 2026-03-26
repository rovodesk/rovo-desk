/** biome-ignore-all lint/suspicious/useAwait: No Awaited Function */
import { vi } from "vitest";
import type { IEmailQueueService, SendEmailArgs } from "../../interface";

export class MockEmailQueueService implements IEmailQueueService {
	transactional: SendEmailArgs[] = [];
	marketing: SendEmailArgs[] = [];

	sendTransactional = vi.fn(async (args: SendEmailArgs) => {
		this.transactional.push(args);
	});

	sendMarketing = vi.fn(async (args: SendEmailArgs) => {
		this.marketing.push(args);
	});

	clear() {
		this.transactional = [];
		this.marketing = [];
		vi.clearAllMocks();
	}
}
