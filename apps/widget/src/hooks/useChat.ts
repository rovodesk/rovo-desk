// src/useChat.ts
import { useEffect, useState } from "react";

export function useChat(apiKey: string) {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const ws = new WebSocket(`wss://your-server.com?key=${apiKey}`);

        ws.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        return () => ws.close();
    }, [apiKey]);

    const send = (msg: string) => {
        // connect to your engine here
        setMessages((prev) => [...prev, `You: ${msg}`]);

        // TODO: send to backend
    };

    return { messages, send };
}