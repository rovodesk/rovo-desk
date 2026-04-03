export type SystemEventType =
	| "system.queue.message_failed"
	| "system.queue.message_retried"
	| "system.job.started"
	| "system.job.completed"
	| "system.job.failed";
