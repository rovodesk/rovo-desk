/** biome-ignore-all lint/correctness/useExhaustiveDependencies: Adding setStatus as deps in useCallback will cause infinite rerenders */
import { useCallback, useRef, useState } from "react";
import type { ChatMessage, IncomingMessage, SessionStatus } from "../types";

type StartSessionOptions = {
    agentId: string;
    connectionType?: "websocket" | "webrtc";
    overrides?: Record<string, unknown>;
    onStatusChange?: (status: { status: SessionStatus }) => void;
};

type UseConversationOptions = {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onMessage?: (message: IncomingMessage) => void;
    onError?: (error: unknown) => void;
    onDebug?: (debug: unknown) => void;
};

export const useConversation = (options: UseConversationOptions = {}) => {
    const { onConnect, onDisconnect, onMessage, onError, onDebug } = options;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputVolume, setInputVolume] = useState(0);
    const [outputVolume, setOutputVolume] = useState(0);

    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number | null>(null);

    const statusRef = useRef<SessionStatus>("disconnected");

    const setStatus = (
        status: SessionStatus,
        cb?: StartSessionOptions["onStatusChange"]
    ) => {
        statusRef.current = status;
        cb?.({ status });
    };

    // 🎤 Start Session
    const startSession = useCallback(
        async (config: StartSessionOptions) => {
            try {
                setStatus("connecting", config.onStatusChange);

                onDebug?.({ type: "session_start", config });

                // 🎤 Only init mic if WebRTC (voice)
                if (config.connectionType === "webrtc") {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });

                    mediaStreamRef.current = stream;

                    const audioContext = new AudioContext();
                    audioContextRef.current = audioContext;

                    const source = audioContext.createMediaStreamSource(stream);
                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 256;

                    source.connect(analyser);
                    analyserRef.current = analyser;

                    const dataArray = new Uint8Array(analyser.frequencyBinCount);

                    const updateVolume = () => {
                        analyser.getByteFrequencyData(dataArray);

                        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

                        setInputVolume(avg / 255);

                        animationRef.current = requestAnimationFrame(updateVolume);
                    };

                    updateVolume();
                }

                // 🧠 Simulate connection delay
                await new Promise((res) => setTimeout(res, 400));

                setStatus("connected", config.onStatusChange);
                onConnect?.();
            } catch (err) {
                onError?.(err);
                setStatus("disconnected", config.onStatusChange);
            }
        },
        [onConnect, onError, onDebug]
    );

    // ⛔ End Session
    const endSession = useCallback(() => {
        try {
            setStatus("disconnecting");

            mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            audioContextRef.current?.close();
            audioContextRef.current = null;

            setInputVolume(0);
            setOutputVolume(0);

            setStatus("disconnected");
            onDisconnect?.();
        } catch (err) {
            onError?.(err);
        }
    }, [onDisconnect, onError]);

    // 📩 Receive message
    const receiveMessage = useCallback(
        (msg: IncomingMessage) => {
            try {
                if (msg.message) {
                    const newMessage: ChatMessage = {
                        role: msg.source,
                        content: msg.message,
                    };

                    setMessages((prev) => [...prev, newMessage]);
                }

                // 🔊 simulate speaking
                setOutputVolume(1);
                setTimeout(() => setOutputVolume(0), 200);

                onMessage?.(msg);
            } catch (err) {
                onError?.(err);
            }
        },
        [onMessage, onError]
    );

    // 💬 Send message
    const sendUserMessage = useCallback(
        (text: string) => {
            const msg: ChatMessage = {
                role: "user",
                content: text,
            };

            setMessages((prev) => [...prev, msg]);

            onDebug?.({ type: "send", text });

            // 🔥 simulate backend response
            setTimeout(() => {
                receiveMessage({
                    source: "assistant",
                    message: "This is a mock response",
                });
            }, 500);
        },
        [receiveMessage, onDebug]
    );

    // 🎤 getters
    const getInputVolume = useCallback(() => inputVolume, [inputVolume]);
    const getOutputVolume = useCallback(() => outputVolume, [outputVolume]);

    return {
        messages,
        setMessages,

        startSession,
        endSession,
        sendUserMessage,

        getInputVolume,
        getOutputVolume,
    };
};
