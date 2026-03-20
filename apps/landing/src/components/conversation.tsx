import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from "@zero-heads-lab/ai/components/conversation";
import { Orb } from "@zero-heads-lab/ai/components/orb";
import { Response } from "@zero-heads-lab/ai/components/response";
import { useConversation } from "@zero-heads-lab/ai/hooks/use-conversation";
import type { SessionStatus } from "@zero-heads-lab/ai/types";
import {
    Message,
    MessageContent,
} from "@zero-heads-lab/design-system/components/message";
import { ShimmeringText } from "@zero-heads-lab/design-system/components/shimmering-text";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@zero-heads-lab/design-system/components/ui/card";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
    AudioLinesIcon,
    CheckIcon,
    CopyIcon,
    PhoneOffIcon,
    SendIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type SystemMessageType = "initial" | "connecting" | "connected" | "error";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    timestamp?: Date;
    type?: SystemMessageType;
}

const DEFAULT_AGENT = {
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
    name: "Customer Support",
    description: "AI Voice Assistant",
};

type ChatActionsProps = ComponentProps<"div">;

const ChatActions = ({ className, children, ...props }: ChatActionsProps) => (
    <div className={cn("flex items-center gap-1", className)} {...props}>
        {children}
    </div>
);

type ChatActionProps = ComponentProps<typeof Button> & {
    tooltip?: string;
    label?: string;
};

const ChatAction = ({
    tooltip,
    children,
    label,
    className,
    variant = "ghost",
    size = "sm",
    ...props
}: ChatActionProps) => {
    const button = (
        <Button
            className={cn(
                "relative size-9 p-1.5 text-muted-foreground hover:text-foreground",
                className
            )}
            size={size}
            type="button"
            variant={variant}
            {...props}
        >
            {children?.toString()}
            <span className="sr-only">{label || tooltip}</span>
        </Button>
    );

    if (tooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return button;
};

export default function ConversationBlock() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [agentState, setAgentState] = useState<SessionStatus>("disconnected");
    const [textInput, setTextInput] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const isTextOnlyModeRef = useRef<boolean>(true);

    const conversation = useConversation({
        onConnect: () => {
            // Only clear messages for voice mode
            if (!isTextOnlyModeRef.current) {
                setMessages([]);
            }
        },
        onDisconnect: () => {
            // Only clear messages for voice mode
            if (!isTextOnlyModeRef.current) {
                setMessages([]);
            }
        },
        onMessage: (message) => {
            if (message.message) {
                const newMessage: ChatMessage = {
                    role: message.source === "user" ? "user" : "assistant",
                    content: message.message,
                };
                setMessages((prev) => [...prev, newMessage]);
            }
        },
        onError: (error) => {
            console.error("Error:", error);
            setAgentState("disconnected");
        },
        onDebug: (debug) => {
            console.log("Debug:", debug);
        },
    });

    const getMicStream = useCallback(async () => {
        if (mediaStreamRef.current) return mediaStreamRef.current;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            setErrorMessage(null);
            return stream;
        } catch (error) {
            if (error instanceof DOMException && error.name === "NotAllowedError") {
                setErrorMessage(
                    "Please enable microphone permissions in your browser."
                );
            }
            throw error;
        }
    }, []);

    const startConversation = useCallback(
        async (textOnly = true, skipConnectingMessage = false) => {
            try {
                isTextOnlyModeRef.current = textOnly;

                if (!skipConnectingMessage) {
                    setMessages([]);
                }

                if (!textOnly) {
                    await getMicStream();
                }

                await conversation.startSession({
                    agentId: DEFAULT_AGENT.agentId,
                    connectionType: textOnly ? "websocket" : "webrtc",
                    overrides: {
                        conversation: {
                            textOnly,
                        },
                        agent: {
                            firstMessage: textOnly ? "" : undefined,
                        },
                    },
                    onStatusChange: (status) => setAgentState(status.status),
                });
            } catch (error) {
                console.error(error);
                setAgentState("disconnected");
                setMessages([]);
            }
        },
        [conversation, getMicStream]
    );

    const handleCall = useCallback(async () => {
        if (agentState === "disconnected" || agentState === null) {
            setAgentState("connecting");
            try {
                await startConversation(false);
            } catch {
                setAgentState("disconnected");
            }
        } else if (agentState === "connected") {
            conversation.endSession();
            setAgentState("disconnected");

            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((t) => t.stop());
                mediaStreamRef.current = null;
            }
        }
    }, [agentState, conversation, startConversation]);

    const handleTextInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setTextInput(e.target.value);
        },
        []
    );

    const handleSendText = useCallback(async () => {
        if (!textInput.trim()) return;

        const messageToSend = textInput;

        if (agentState === "disconnected" || agentState === null) {
            const userMessage: ChatMessage = {
                role: "user",
                content: messageToSend,
            };
            setTextInput("");
            setAgentState("connecting");

            try {
                await startConversation(true, true);
                // Add message once converstation started
                setMessages([userMessage]);
                // Send message after connection is established
                conversation.sendUserMessage(messageToSend);
            } catch (error) {
                console.error("Failed to start conversation:", error);
            }
        } else if (agentState === "connected") {
            const newMessage: ChatMessage = {
                role: "user",
                content: messageToSend,
            };
            setMessages((prev) => [...prev, newMessage]);
            setTextInput("");

            conversation.sendUserMessage(messageToSend);
        }
    }, [textInput, agentState, conversation, startConversation]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
            }
        },
        [handleSendText]
    );

    useEffect(() => {
        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            }
        };
    }, []);

    const isCallActive = agentState === "connected";
    const isTransitioning =
        agentState === "connecting" || agentState === "disconnecting";

    const getInputVolume = useCallback(() => {
        const rawValue = conversation.getInputVolume?.() ?? 0;
        return Math.min(1.0, rawValue ** 0.5 * 2.5);
    }, [conversation]);

    const getOutputVolume = useCallback(() => {
        const rawValue = conversation.getOutputVolume?.() ?? 0;
        return Math.min(1.0, rawValue ** 0.5 * 2.5);
    }, [conversation]);

    return (
        <Card
            className={cn(
                "mx-auto flex h-[400px] w-full flex-col gap-0 overflow-hidden bg-transparent!"
            )}
        >
            <CardHeader className="flex shrink-0 flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-4">
                    <div className="relative size-10 overflow-hidden rounded-full ring-1 ring-border">
                        <Orb
                            className="h-full w-full"
                            getInputVolume={getInputVolume}
                            getOutputVolume={getOutputVolume}
                            volumeMode="manual"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="font-medium text-sm leading-none">
                            {DEFAULT_AGENT.name}
                        </p>
                        <div className="flex items-center gap-2">
                            {errorMessage ? (
                                <p className="text-destructive text-xs">{errorMessage}</p>
                            ) : agentState === "disconnected" || agentState === null ? (
                                <p className="text-muted-foreground text-xs">
                                    Tap to start voice chat
                                </p>
                            ) : agentState === "connected" ? (
                                <p className="text-green-600 text-xs">Connected</p>
                            ) : isTransitioning ? (
                                <ShimmeringText
                                    className="text-xs capitalize"
                                    text={agentState}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
                <div
                    className={cn(
                        "flex h-2 w-2 rounded-full transition-all duration-300",
                        agentState === "connected" &&
                        "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
                        isTransitioning && "animate-pulse bg-white/40"
                    )}
                />
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <Conversation className="h-full">
                    <ConversationContent className="flex min-w-0 flex-col gap-2 p-6 pb-2">
                        {messages.length === 0 ? (
                            <ConversationEmptyState
                                description={
                                    agentState === "connecting"
                                        ? "Connecting..."
                                        : agentState === "connected"
                                            ? "Ready to chat"
                                            : "Type a message or tap the voice button"
                                }
                                icon={<Orb className="size-12" />}
                                title={
                                    agentState === "connecting" ? (
                                        <ShimmeringText text="Starting conversation" />
                                    ) : agentState === "connected" ? (
                                        <ShimmeringText text="Start talking or type" />
                                    ) : (
                                        "Start a conversation"
                                    )
                                }
                            />
                        ) : (
                            messages.map((message, index) => {
                                return (
                                    <div className="flex w-full flex-col gap-1" key={index}>
                                        <Message from={message.role}>
                                            <MessageContent className="min-w-0 max-w-full">
                                                <Response className="wrap-anywhere w-auto whitespace-pre-wrap">
                                                    {message.content}
                                                </Response>
                                            </MessageContent>
                                            {message.role === "assistant" && (
                                                <div className="size-6 shrink-0 self-end overflow-hidden rounded-full ring-1 ring-border">
                                                    <Orb
                                                        agentState={
                                                            isCallActive && index === messages.length - 1
                                                                ? "talking"
                                                                : null
                                                        }
                                                        className="h-full w-full"
                                                    />
                                                </div>
                                            )}
                                        </Message>
                                        {message.role === "assistant" && (
                                            <ChatActions>
                                                <ChatAction
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(message.content);
                                                        setCopiedIndex(index);
                                                        setTimeout(() => setCopiedIndex(null), 2000);
                                                    }}
                                                    size="sm"
                                                    tooltip={copiedIndex === index ? "Copied!" : "Copy"}
                                                >
                                                    {copiedIndex === index ? (
                                                        <CheckIcon className="size-4" />
                                                    ) : (
                                                        <CopyIcon className="size-4" />
                                                    )}
                                                </ChatAction>
                                            </ChatActions>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </ConversationContent>
                    <ConversationScrollButton />
                </Conversation>
            </CardContent>
            <CardFooter className="shrink-0 border-t">
                <div className="flex w-full items-center gap-2">
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            className="h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isTransitioning}
                            onChange={handleTextInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            value={textInput}
                        />
                        <Button
                            className="rounded-full"
                            disabled={!textInput.trim() || isTransitioning}
                            onClick={handleSendText}
                            size="icon"
                            variant="ghost"
                        >
                            <SendIcon className="size-4" />
                            <span className="sr-only">Send message</span>
                        </Button>
                        {!isCallActive && (
                            <Button
                                className={cn("relative shrink-0 rounded-full transition-all")}
                                disabled={isTransitioning}
                                onClick={handleCall}
                                size="icon"
                                variant="ghost"
                            >
                                <AudioLinesIcon className="size-4" />
                                <span className="sr-only">Start voice call</span>
                            </Button>
                        )}
                        {isCallActive && (
                            <Button
                                className={cn("relative shrink-0 rounded-full transition-all")}
                                disabled={isTransitioning}
                                onClick={handleCall}
                                size="icon"
                                variant="secondary"
                            >
                                <PhoneOffIcon className="size-4" />
                                <span className="sr-only">End call</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
