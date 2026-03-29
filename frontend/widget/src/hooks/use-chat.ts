import type { Message } from "@zero-heads-lab/shared/types";
import PartySocket from "partysocket";
import { useEffect, useRef, useState } from "react";

type ServerEvent =
	| { type: "history"; data: Message[] }
	| { type: "message"; data: Message };

export function useChat({
	roomId,
	token,
	initialMessages = [],
	senderId = "me",
	onMessagesChange,
}: {
	roomId: string;
	token?: string;
	initialMessages?: Message[];
	senderId?: string;
	onMessagesChange?: (messages: Message[]) => void;
}) {
	const socketRef = useRef<PartySocket | null>(null);
	const [messages, setMessages] = useState<Message[]>(() => {
		const unique: Message[] = [];
		const seen = new Set<string>();

		for (const m of initialMessages) {
			if (!seen.has(m.id)) {
				seen.add(m.id);
				unique.push(m);
			}
		}

		return unique;
	});
	const [isConnected, setIsConnected] = useState(false);

	// 🔒 prevent duplicate messages (optimistic + server echo)
	const messageIds = useRef<Set<string>>(new Set(messages.map((m) => m.id)));

	// Sync messages back to caller whenever they change
	useEffect(() => {
		onMessagesChange?.(messages);
	}, [messages, onMessagesChange]);

	useEffect(() => {
		const socket = new PartySocket({
			host: import.meta.env.VITE_PARTYKIT_HOST,
			room: roomId,
			path: `chatroom/${roomId}`,
			basePath: "widget",
			query: { token },
		});

		socketRef.current = socket;

		socket.onopen = () => setIsConnected(true);
		socket.onclose = () => setIsConnected(false);

		socket.onmessage = (event) => {
			try {
				const data: ServerEvent = JSON.parse(event.data);

				switch (data.type) {
					case "history": {
						const serverMessages = data.data;
						setMessages((prev) => {
							const newMessages = [...prev];
							for (const m of serverMessages) {
								if (!messageIds.current.has(m.id)) {
									messageIds.current.add(m.id);
									newMessages.push(m);
								}
							}
							return newMessages.sort(
								(a, b) =>
									new Date(a.createdAt).getTime() -
									new Date(b.createdAt).getTime()
							);
						});
						break;
					}

					case "message": {
						const msg = data.data;

						// 🚫 dedupe
						if (messageIds.current.has(msg.id)) return;
						messageIds.current.add(msg.id);

						setMessages((prev) => [...prev, msg]);
						break;
					}

					default: {
						console.warn("Unknown message type", data);
					}
				}
			} catch (err) {
				console.error("Invalid WS message", err);
			}
		};

		return () => {
			socket.close();
		};
	}, [roomId, token]);

	// 🚀 Send message (aligned with schema)
	const sendMessage = (text: string) => {
		if (!socketRef.current) return;

		const tempId = crypto.randomUUID();

		const tempMessage: Message = {
			id: tempId,
			type: "text",
			senderId,
			text,
			createdAt: new Date().toISOString(),
		};

		// optimistic update
		messageIds.current.add(tempId);
		setMessages((prev) => [...prev, tempMessage]);

		socketRef.current.send(
			JSON.stringify({
				type: "message",
				data: {
					text,
				},
			})
		);
	};

	return {
		messages,
		sendMessage,
		isConnected,
	};
}
