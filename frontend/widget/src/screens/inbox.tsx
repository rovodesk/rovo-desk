// import type { WidgetState } from "@zero-heads-lab/engine";
// import { ArrowUpRight, MessageCircle } from "lucide-react";
// import { useMemo } from "react";
// import { useChat } from "@/hooks/use-chat";
// import { useWidgetActions } from "@/hooks/use-widget-actions";

// export function InboxScreen({ state }: { state: WidgetState }) {
// 	const actions = useWidgetActions();
// 	const session = state.session;

// 	// Fetch latest history using useChat
// 	const { messages } = useChat({
// 		roomId: state.session?.user?.id || state.session?.sessionId || "default",
// 		token: session?.token,
// 		initialMessages: state.chat?.messages,
// 		senderId: session?.user?.id || state.session?.sessionId,
// 	});

// 	const conversationGroups = useMemo(() => {
// 		if (!messages || messages.length === 0) return [];

// 		// We show the current room as a single entry in the inbox
// 		const lastMessage = messages.at(-1);
// 		if (!lastMessage) return [];

// 		return [
// 			{
// 				id: "current",
// 				title: "Support Chat",
// 				preview: lastMessage.text || "No text",
// 				time: new Date(lastMessage.createdAt).toLocaleTimeString([], {
// 					hour: "2-digit",
// 					minute: "2-digit",
// 				}),
// 				unread: false,
// 			},
// 		];
// 	}, [messages]);

// 	return (
// 		<div className="relative flex h-full flex-col justify-between overflow-hidden bg-black text-white">
// 			{/* Content */}
// 			<div className="relative z-10 flex h-full flex-col">
// 				{/* Header */}
// 				<div className="px-5 pt-5 pb-3 text-left">
// 					<h1 className="font-semibold text-xl tracking-tight">Inbox</h1>
// 					<p className="text-sm text-white/50">
// 						Your conversations with support
// 					</p>
// 				</div>

// 				{/* Messages List */}
// 				<div className="flex-1 space-y-3 overflow-y-auto px-4 pb-24">
// 					{conversationGroups.length === 0 ? (
// 						<div className="flex h-[60%] flex-col items-center justify-center text-center text-white/40">
// 							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
// 								<MessageCircle className="h-8 w-8 opacity-20" />
// 							</div>
// 							<p className="font-medium">No messages yet</p>
// 							<p className="mt-1 text-xs">
// 								Start a conversation to see it here
// 							</p>
// 						</div>
// 					) : (
// 						conversationGroups.map((group) => (
// 							<button
// 								className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:bg-white/10 active:scale-[0.98]"
// 								key={group.id}
// 								onClick={() => actions.switchTab("conversation")}
// 								type="button"
// 							>
// 								<div className="flex w-full items-start justify-between gap-3">
// 									<div className="min-w-0 flex-1">
// 										<div className="mb-1 flex items-center gap-2">
// 											<p className="font-semibold text-sm">{group.title}</p>
// 											{group.unread && (
// 												<span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(35,93,252,0.6)]" />
// 											)}
// 										</div>
// 										<p className="line-clamp-2 text-sm text-white/60 leading-snug">
// 											{group.preview}
// 										</p>
// 									</div>
// 									<div className="flex flex-col items-end gap-2">
// 										<span className="font-medium text-[10px] text-white/30 uppercase tracking-wider">
// 											{group.time}
// 										</span>
// 										<div className="flex -space-x-2">
// 											<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-blue-600 font-bold text-[10px]">
// 												R
// 											</div>
// 											<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-gray-700 font-bold text-[10px] transition-transform group-hover:translate-x-1">
// 												U
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 							</button>
// 						))
// 					)}
// 				</div>

// 				{/* Floating Action Button */}
// 				<div className="pointer-events-none absolute right-0 bottom-6 left-0 flex justify-center px-4">
// 					<button
// 						className="group pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-white px-6 py-3.5 font-bold text-black text-sm shadow-2xl transition-all hover:scale-105 active:scale-95"
// 						onClick={() => actions.switchTab("conversation")}
// 						type="button"
// 					>
// 						<MessageCircle className="h-4 w-4" />
// 						Start new chat
// 						<ArrowUpRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
