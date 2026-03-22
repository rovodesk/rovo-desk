import { useWidgetActions } from "@/hooks/use-widget-actions";
import { MessageCircle, ArrowUpRight } from "lucide-react";

export function InboxScreen() {
    const messages = [
        {
            id: 1,
            title: "Welcome 👋",
            preview: "Hey! Let us know if you need help.",
            time: "2m",
        },
        {
            id: 2,
            title: "Support",
            preview: "Your issue has been resolved.",
            time: "1h",
        },
    ];

    const actions = useWidgetActions();

    return (
        <div className="relative flex h-full flex-col justify-between overflow-hidden bg-black text-white">
            {/* Content */}
            <div className="relative z-10 flex h-full flex-col">
                {/* Header */}
                <div className="px-5 pt-5 pb-3">
                    <h1 className="text-lg font-semibold">Inbox</h1>
                    <p className="text-sm text-white/60">
                        Messages & support
                    </p>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-24">
                    {messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-white/60">
                            <MessageCircle className="mb-3 h-6 w-6 opacity-60" />
                            <p>No messages yet</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/10"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {msg.title}
                                        </p>
                                        <p className="text-sm text-white/60 line-clamp-1">
                                            {msg.preview}
                                        </p>
                                    </div>
                                    <span className="text-xs text-white/40">
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Floating Button */}
                <div className="pointer-events-none absolute bottom-5 left-0 right-0 flex justify-center px-4">
                    <button
                        className="pointer-events-auto flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium shadow-lg text-black"
                        onClick={() => actions.navigate("conversation")}
                    >
                        <MessageCircle className="h-4 w-4" />
                        Send us a message
                        <ArrowUpRight className="h-4 w-4 opacity-70" />
                    </button>
                </div>
            </div>
        </div>
    );
}