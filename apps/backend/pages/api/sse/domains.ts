import { EventEmitter } from "events";

type DomainEvent =
	| { type: "domainCreated"; payload: unknown }
	| { type: "domainUpdated"; payload: unknown };

// In-process emitter for broadcasting events to SSE clients
const domainEmitter = new EventEmitter();

export function broadcastDomainEvent(event: DomainEvent) {
	domainEmitter.emit("domain", event);
}

export default function handler(req: any, res: any) {
	if (req.method === "GET") {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.write("\n");

		const onEvent = (event: DomainEvent) => {
			res.write(`data: ${JSON.stringify(event)}\n\n`);
		};
		domainEmitter.on("domain", onEvent);

		// Cleanup when the client disconnects
		req.on("close", () => {
			domainEmitter.off("domain", onEvent);
		});
		return;
	}

	if (req.method === "POST") {
		// Accept events from clients or internal services
		const event = req.body as DomainEvent;
		domainEmitter.emit("domain", event);
		res.status(204).end();
		return;
	}

	res.setHeader("Allow", "GET,POST");
	res.status(405).end();
}
