import type { IQueueService } from "@zero-heads-lab/queue/interface";
import type {
	EmailQueueJob,
	IEmailQueueService,
	SendEmailArgs,
} from "./interface";

export class EmailQueueService implements IEmailQueueService {
	private readonly queue: IQueueService;

	constructor(queue: IQueueService) {
		this.queue = queue;
	}

	async sendTransactional(args: SendEmailArgs): Promise<void> {
		const payload: EmailQueueJob = {
			type: "transactional",
			payload: args,
			metadata: {
				timestamp: new Date().toISOString(),
			},
		};

		await this.queue.enqueueJob({
			job: "send-transactional-email",
			data: payload,
		});
	}

	async sendMarketing(args: SendEmailArgs): Promise<void> {
		const payload: EmailQueueJob = {
			type: "marketing",
			payload: args,
			metadata: {
				timestamp: new Date().toISOString(),
			},
		};

		await this.queue.enqueueJob({
			job: "send-marketing-email",
			data: payload,
		});
	}
}
