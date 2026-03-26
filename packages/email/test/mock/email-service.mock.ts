/** biome-ignore-all lint/suspicious/useAwait: No Awaited Function */
import { vi } from "vitest";
import type {
	IEmailService,
	SendEmailArgs,
	SendEmailResult,
} from "../../interface";

export class MockEmailService implements IEmailService {
	transactional: SendEmailArgs[] = [];
	marketing: SendEmailArgs[] = [];

	shouldFail = false;

	sendTransactional = vi.fn(
		async (args: SendEmailArgs): Promise<SendEmailResult> => {
			if (this.shouldFail) {
				throw new Error("Transactional email failed");
			}

			this.transactional.push(args);

			return {
				id: "mock-tx-id",
			};
		}
	);

	sendMarketing = vi.fn(
		async (args: SendEmailArgs): Promise<SendEmailResult> => {
			if (this.shouldFail) {
				throw new Error("Marketing email failed");
			}

			this.marketing.push(args);

			return {
				id: "mock-mkt-id",
			};
		}
	);

	clear() {
		this.transactional = [];
		this.marketing = [];
		this.shouldFail = false;
		vi.clearAllMocks();
	}
}
