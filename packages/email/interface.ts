export interface SendEmailArgs {
	to: string | string[];
	subject: string;
	react?: React.ReactNode;
	html?: string;
	text?: string;
	from?: string;
	replyTo?: string;
}

export interface SendEmailResult {
	id?: string | string[];
}

export interface IEmailService {
	sendTransactional(args: SendEmailArgs): Promise<SendEmailResult>;
	sendMarketing(args: SendEmailArgs): Promise<SendEmailResult>;
}

export type EmailCategory = "transactional" | "marketing";

export interface EmailQueueJob {
	type: EmailCategory;
	payload: SendEmailArgs;
	metadata?: {
		id?: string;
		traceId?: string;
		userId?: string;
		orgId?: string;
		timestamp?: string;
	};
}

export interface EmailServiceOptions {
	apiKey: string;
	transactionalFrom: string;
	marketingFrom?: string;
}

export interface IEmailQueueService {
	sendTransactional(args: SendEmailArgs): Promise<void>;
	sendMarketing(args: SendEmailArgs): Promise<void>;
}
