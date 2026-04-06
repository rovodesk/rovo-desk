// import type { WidgetState } from "@zero-heads-lab/engine";
// import {
// 	ArrowLeft,
// 	MessageCircle,
// 	Paperclip,
// 	SendHorizonal,
// 	Smile,
// } from "lucide-react";
// import type { Message } from "partysocket/ws";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { CloseIcon } from "@/components/icons";
// import { useChat } from "@/hooks/use-chat";
// import { useWidgetActions } from "@/hooks/use-widget-actions";

// function getConversationBlock(state: WidgetState) {
// 	const screens =
// 		state.session?.mode === "user"
// 			? state.config?.widget?.screens.user.screens
// 			: state.config?.widget?.screens.visitor.screens;

// 	const conversationScreen = screens?.find(
// 		(s: { tab: string }) => s.tab === "conversation"
// 	);

// 	if (!conversationScreen) return null;

// 	return conversationScreen.blocks.find(
// 		(b: { type: string }) => b.type === "conversation"
// 	);
// }

// export function ConversationScreen({ state }: { state: WidgetState }) {
// 	const actions = useWidgetActions();
// 	const block = getConversationBlock(state);
// 	const scrollRef = useRef<HTMLDivElement>(null);

// 	const config = block?.config ?? {};
// 	const session = state.session;
// 	const currentUserId = session?.user?.id;

// 	const onMessagesChange = useCallback(
// 		(messages: Message[]) => {
// 			for (const message of messages) {
// 				actions.addMessage(message);
// 			}
// 		},
// 		[actions]
// 	);

// 	const { messages, sendMessage, isConnected } = useChat({
// 		roomId: session?.user?.id || session?.sessionId || "default",
// 		token: session?.token,
// 		initialMessages: state.chat?.messages,
// 		senderId: currentUserId || session?.sessionId,
// 		onMessagesChange,
// 	});

// 	const [input, setInput] = useState("");

// 	// Auto-scroll to bottom
// 	useEffect(() => {
// 		if (scrollRef.current && messages.length > 0) {
// 			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
// 		}
// 	}, [messages]);

// 	const handleSendMessage = () => {
// 		if (!input.trim()) return;
// 		sendMessage(input);
// 		setInput("");
// 	};

// 	return (
// 		<div className="relative flex h-full flex-col bg-slate-50 text-slate-900">
// 			{/* INTERCOM-STYLE HEADER */}
// 			<div className="z-10 flex items-center justify-between border-slate-100 border-b bg-white px-4 py-4 shadow-sm">
// 				<button
// 					className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
// 					onClick={() => actions.switchTab("welcome")}
// 					type="button"
// 				>
// 					<ArrowLeft className="h-5 w-5 text-blue-600" />
// 				</button>

// 				<div className="flex flex-col items-center gap-0.5">
// 					<div className="flex -space-x-2">
// 						<img
// 							alt="A"
// 							className="h-7 w-7 rounded-full border-2 border-white bg-slate-200"
// 							src="https://github.com/haydenbleasel.png"
// 						/>
// 						<img
// 							alt="B"
// 							className="h-7 w-7 rounded-full border-2 border-white bg-slate-200"
// 							src="https://github.com/shadcn.png"
// 						/>
// 					</div>
// 					<p className="font-bold text-[13px] text-slate-800 tracking-tight">
// 						{config.headerTitle || "Support Team"}
// 					</p>
// 					<div className="flex items-center gap-1">
// 						<span
// 							className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-green-500" : "bg-orange-400"} animate-pulse`}
// 						/>
// 						<p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider">
// 							{isConnected ? "Replies in minutes" : "Connecting..."}
// 						</p>
// 					</div>
// 				</div>

// 				<button
// 					className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
// 					onClick={() => actions.close()}
// 					type="button"
// 				>
// 					<CloseIcon />
// 				</button>
// 			</div>

// 			{/* MESSAGES TRANSCRIPT */}
// 			<div
// 				className="flex-1 space-y-6 overflow-y-auto scroll-smooth px-5 py-8"
// 				ref={scrollRef}
// 			>
// 				{messages.length === 0 && (
// 					<div className="flex h-full flex-col items-center justify-center opacity-40">
// 						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
// 							<MessageCircle className="h-8 w-8 text-slate-400" />
// 						</div>
// 						<p className="font-medium text-sm">No messages yet</p>
// 						<p className="text-xs">Ask us anything!</p>
// 					</div>
// 				)}

// 				{messages.map((msg, i) => {
// 					const isUser = msg.senderId === currentUserId;
// 					const showAvatar =
// 						!isUser &&
// 						(i === messages.length - 1 ||
// 							messages[i + 1]?.senderId === currentUserId);

// 					return (
// 						<div
// 							className={`fade-in slide-in-from-bottom-2 flex animate-in ${isUser ? "justify-end" : "justify-start"}`}
// 							key={msg.id}
// 						>
// 							<div
// 								className={`flex max-w-[85%] items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
// 							>
// 								{!isUser && (
// 									<div className="h-7 w-7 shrink-0 translate-y-[2px] overflow-hidden rounded-full border bg-slate-200">
// 										{showAvatar ? (
// 											<img
// 												alt="S"
// 												className="h-full w-full object-cover"
// 												src="https://github.com/haydenbleasel.png"
// 											/>
// 										) : (
// 											<div className="h-full w-full" />
// 										)}
// 									</div>
// 								)}

// 								<div className="space-y-1">
// 									<div
// 										className="px-4 py-2.5 font-medium text-sm leading-normal shadow-sm ring-1 ring-black/5"
// 										style={{
// 											borderRadius: "18px",
// 											borderBottomRightRadius: isUser ? "4px" : "18px",
// 											borderBottomLeftRadius: isUser ? "18px" : "4px",
// 											background: isUser ? "#2563eb" : "#ffffff",
// 											color: isUser ? "#ffffff" : "#1e293b",
// 										}}
// 									>
// 										{msg.text || msg.message}
// 									</div>

// 									{config.showTimestamp && (
// 										<p
// 											className={`font-bold text-[10px] text-slate-400 uppercase tracking-widest ${isUser ? "mr-1 text-right" : "ml-1 text-left"}`}
// 										>
// 											{new Date(
// 												msg.createdAt || msg.timestamp
// 											).toLocaleTimeString([], {
// 												hour: "2-digit",
// 												minute: "2-digit",
// 											})}
// 										</p>
// 									)}
// 								</div>
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>

// 			{/* INTERCOM-STYLE INPUT BAR */}
// 			<div className="border-slate-100 border-t bg-white px-4 pt-3 pb-6">
// 				<div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
// 					<textarea
// 						className="max-h-32 min-h-[44px] w-full resize-none bg-transparent px-3 pt-2 font-medium text-sm outline-none placeholder:text-slate-400"
// 						onChange={(e) => setInput(e.target.value)}
// 						onKeyDown={(e) => {
// 							if (e.key === "Enter" && !e.shiftKey) {
// 								e.preventDefault();
// 								handleSendMessage();
// 							}
// 						}}
// 						placeholder={config.placeholder || "Write a reply..."}
// 						rows={1}
// 						value={input}
// 					/>

// 					<div className="flex items-center justify-between border-slate-50 border-t px-1 pt-2">
// 						<div className="flex items-center gap-1">
// 							<button
// 								className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-blue-600"
// 								type="button"
// 							>
// 								<Smile className="h-5 w-5" />
// 							</button>
// 							{config.allowAttachments && (
// 								<button
// 									className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-blue-600"
// 									type="button"
// 								>
// 									<Paperclip className="h-5 w-5" />
// 								</button>
// 							)}
// 						</div>

// 						<button
// 							className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
// 								input.trim()
// 									? "bg-blue-600 text-white shadow-lg active:scale-95"
// 									: "bg-slate-100 text-slate-400 opacity-50"
// 							}`}
// 							disabled={!input.trim()}
// 							onClick={handleSendMessage}
// 							type="button"
// 						>
// 							<SendHorizonal className="h-4 w-4" />
// 						</button>
// 					</div>
// 				</div>

// 				<p className="mt-3 text-center font-bold text-[10px] text-slate-300 uppercase tracking-widest">
// 					Press{" "}
// 					<span className="rounded bg-slate-100 px-1 py-0.5 text-slate-400">
// 						Enter
// 					</span>{" "}
// 					to send
// 				</p>
// 			</div>
// 		</div>
// 	);
// }
