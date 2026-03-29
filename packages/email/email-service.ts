import { pretty, render } from "@react-email/render";
import type { ITracer } from "@zero-heads-lab/analytics/types";
import { Resend } from "resend";
import type {
	EmailServiceOptions,
	IEmailService,
	SendEmailArgs,
	SendEmailResult,
} from "./interface";

export class EmailService implements IEmailService {
	private readonly resend: Resend;
	private readonly transactionalFrom: string;
	private readonly marketingFrom: string;
	private readonly tracer: ITracer;

	constructor(options: EmailServiceOptions, tracer: ITracer) {
		this.resend = new Resend(options.apiKey);
		this.transactionalFrom = options.transactionalFrom;
		this.marketingFrom = options.marketingFrom ?? options.transactionalFrom;
		this.tracer = tracer;
	}

	private async renderHtml(args: SendEmailArgs): Promise<string> {
		if (!(args.react || args.html)) {
			throw new Error("Either 'react' or 'html' must be provided");
		}

		return args.html ?? (await pretty(await render(args.react!)));
	}

	async sendTransactional(args: SendEmailArgs): Promise<SendEmailResult> {
		return await this.tracer.withSpan(
			"email.sendTransactional",
			async (span) => {
				span.setAttributes({
					"email.category": "transactional",
					"email.provider": "resend",
					"email.recipient_count": Array.isArray(args.to) ? args.to.length : 1,
				});

				try {
					const html = await this.renderHtml(args);

					const { data, error } = await this.resend.emails.send({
						from: args.from ?? this.transactionalFrom,
						to: Array.isArray(args.to) ? args.to : [args.to],
						subject: args.subject,
						html,
						text: args.text,
						replyTo: args.replyTo,
					});

					if (error) {
						throw new Error(`Transactional email failed: ${error.message}`);
					}

					return { id: data?.id };
				} catch (error) {
					span.recordException?.(error as Error);
					throw error;
				}
			}
		);
	}

	async sendMarketing(args: SendEmailArgs): Promise<SendEmailResult> {
		return await this.tracer.withSpan("email.sendMarketing", async (span) => {
			span.setAttributes({
				"email.category": "marketing",
				"email.provider": "resend",
				"email.recipient_count": Array.isArray(args.to) ? args.to.length : 1,
			});

			try {
				const html = await this.renderHtml(args);

				const { data, error } = await this.resend.emails.send({
					from: args.from ?? this.marketingFrom,
					to: Array.isArray(args.to) ? args.to : [args.to],
					subject: args.subject,
					html,
					text: args.text,
					replyTo: args.replyTo,
				});

				if (error) {
					throw new Error(`Marketing email failed: ${error.message}`);
				}

				return { id: data?.id };
			} catch (error) {
				span.recordException?.(error as Error);
				throw error;
			}
		});
	}
}
