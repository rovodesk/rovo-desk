import { CloseIcon } from "@/components/icons";
import { useWidgetActions } from "@/hooks/use-widget-actions";
import { useState } from "react";
import { ArrowUp, ArrowLeft, PhoneCall, Paperclip } from "lucide-react";
import Logo from "@/components/logo";

export function ConversationScreen() {
    const actions = useWidgetActions();

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi there 👋\n\nYou are now speaking with Rovo. How can I help?",
            time: "Just now",
        },
    ]);

    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages((prev) => [
            ...prev,
            { role: "user", content: input, time: "Now" },
            {
                role: "assistant",
                content: "Got it — let me help you with that.",
                time: "Now",
            },
        ]);

        setInput("");
    };

    return (
        <div className="relative flex h-full flex-col overflow-hidden bg-black text-white">
            <div className="relative z-10 flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-[#161618] border-white/10 px-4 py-3">
                    <div className="flex items-center gap-4">
                        <button onClick={() => actions.navigate("inbox")}>
                            <ArrowLeft className="h-4 w-4/ text-white/60 hover:text-white" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Logo size={8} />
                            <div>
                                <p className="text-sm font-medium">Rovo</p>
                                <p className="text-xs text-white/50">
                                    The team can also help
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => actions.navigate("help")}
                            className="text-white/60 hover:text-white"
                            disabled={true}
                        >
                            <PhoneCall className="h-4 w-4 data-disabled:text-white/20" />
                        </button>
                        <button
                            onClick={() => actions.close()}
                            className="text-white/60 hover:text-white"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
                    {messages.map((msg, i) => {
                        const isUser = msg.role === "user";

                        return (
                            <div
                                key={i}
                                className={`flex ${isUser ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div className="max-w-[80%]">
                                    {/* Bubble */}
                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white/10 text-white/90 backdrop-blur"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {/* Meta */}
                                    {!isUser && (
                                        <p className="mt-2 text-xs text-white/40">
                                            Fin • AI Agent • {msg.time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Floating Input */}
                <div className="pointer-events-none absolute bottom-4 left-0 right-0 px-4">
                    <div className="pointer-events-auto rounded-2xl border border-white/20 bg-white/5 p-2 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={sendMessage}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:text-white"
                            >
                                <Paperclip className="h-4 w-4" />
                            </button>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                                placeholder="Ask a question..."
                                className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/40"
                            />

                            <button
                                onClick={sendMessage}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                            >
                                <ArrowUp className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-2 text-center text-[11px] text-white/30">
                        By chatting with us, you agree to our Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}