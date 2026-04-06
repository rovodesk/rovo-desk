// import type { WidgetState } from "@zero-heads-lab/engine";
// import {
// 	ArrowUpRight,
// 	ChevronRight,
// 	HelpCircle,
// 	MessageCircle,
// 	Search,
// } from "lucide-react";
// import { AvatarGroup } from "@/components/avatar";
// import { CloseIcon } from "@/components/icons";
// import Logo from "@/components/logo";
// import { useWidgetActions } from "@/hooks/use-widget-actions";

// function getWelcomeBlock(state: WidgetState) {
// 	if (!state.config?.widget?.screens) return null;

// 	const mode = state.session.mode || "visitor";
// 	const screens = state.config?.widget.screens[mode]?.screens;

// 	if (!screens) return null;

// 	const welcomeScreen = screens.find(
// 		(s: { tab: string }) => s.tab === "welcome"
// 	);

// 	if (!welcomeScreen) return null;

// 	return welcomeScreen.blocks.find(
// 		(b: { type: string }) => b.type === "welcome"
// 	);
// }

// export function WelcomeScreen({ state }: { state: WidgetState }) {
// 	const actions = useWidgetActions();

// 	const block = getWelcomeBlock(state) || {
// 		config: {
// 			title: "Hello there!",
// 			subtitle: "How can we help you today?",
// 			showOnlineAvatars: true,
// 			showSearchBar: true,
// 			showConversationShortcut: true,
// 			showMostViewedArticles: true,
// 			showRecentlyPublishedArticles: true,
// 		},
// 	};
// 	const config = block?.config ?? {};
// 	const messages = state.chat?.messages || [];
// 	const lastMessage = messages.at(-1);

// 	return (
// 		<div className="relative flex h-full flex-col overflow-hidden bg-white text-slate-900">
// 			{/* INTERCOM-STYLE HEADER */}
// 			<div className="relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 px-6 pt-10 pb-16 text-white shadow-lg">
// 				<div className="relative z-10">
// 					<div className="flex items-center justify-between">
// 						<div className="h-8 w-8 rounded-lg bg-white/20 p-1.5 backdrop-blur-md">
// 							<Logo />
// 						</div>
// 						<button
// 							className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
// 							onClick={() => actions.close()}
// 							type="button"
// 						>
// 							<CloseIcon />
// 						</button>
// 					</div>

// 					<div className="mt-8 space-y-1">
// 						<h1 className="font-bold text-[28px] leading-tight tracking-tight">
// 							{config.title || "Hello!"}
// 						</h1>
// 						<p className="font-medium text-lg text-white/80">
// 							{config.subtitle || "How can we help today?"}
// 						</p>
// 					</div>

// 					{config.showOnlineAvatars && (
// 						<div className="mt-6 flex items-center gap-3">
// 							<AvatarGroup />
// 							<p className="font-semibold text-[11px] text-white/60 uppercase tracking-widest">
// 								Typically replies in minutes
// 							</p>
// 						</div>
// 					)}
// 				</div>

// 				{/* Decorative Elements */}
// 				<div className="absolute top-[-20%] right-[-10%] h-64 w-64 rounded-full bg-white/5 blur-3xl" />
// 			</div>

// 			{/* CONTENT AREA (FLOATING UP) */}
// 			<div className="relative z-20 -mt-10 flex-1 space-y-4 overflow-y-auto px-5 pt-2 pb-10">
// 				{/* MESSAGES CARD */}
// 				{config.showConversationShortcut && (
// 					<div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 transition-all hover:ring-blue-500/30">
// 						<div className="mb-4 flex items-center justify-between">
// 							<h2 className="font-bold text-sm uppercase tracking-tight opacity-50">
// 								Messages
// 							</h2>
// 							<MessageCircle className="h-4 w-4 text-blue-600" />
// 						</div>

// 						{messages.length > 0 ? (
// 							<button
// 								className="flex w-full items-center gap-4 text-left transition"
// 								onClick={() => actions.switchTab("conversation")}
// 								type="button"
// 							>
// 								<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-white bg-slate-100 shadow-sm ring-2 ring-white">
// 									<img
// 										alt="Support"
// 										className="h-full w-full object-cover"
// 										src="https://github.com/haydenbleasel.png"
// 									/>
// 									<div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-sm" />
// 								</div>
// 								<div className="min-w-0 flex-1">
// 									<p className="font-semibold text-sm">Recent conversation</p>
// 									<p className="truncate font-medium text-slate-500 text-xs">
// 										{lastMessage?.message || "You: Open for messages"}
// 									</p>
// 								</div>
// 								<ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5" />
// 							</button>
// 						) : (
// 							<button
// 								className="flex w-full items-center justify-between rounded-xl bg-blue-50 px-4 py-4 text-blue-700 transition hover:bg-blue-100"
// 								onClick={() => actions.switchTab("conversation")}
// 								type="button"
// 							>
// 								<div className="flex items-center gap-3 text-left">
// 									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-inner">
// 										<MessageCircle className="h-5 w-5" />
// 									</div>
// 									<div>
// 										<p className="font-bold text-sm">Send us a message</p>
// 										<p className="font-semibold text-[11px] opacity-70">
// 											Support replies quickly
// 										</p>
// 									</div>
// 								</div>
// 								<ArrowUpRight className="h-4 w-4" />
// 							</button>
// 						)}

// 						{messages.length > 0 && (
// 							<button
// 								className="mt-4 w-full font-bold text-[13px] text-blue-600 hover:underline"
// 								onClick={() => actions.switchTab("inbox")}
// 								type="button"
// 							>
// 								See all conversations
// 							</button>
// 						)}
// 					</div>
// 				)}

// 				{/* SEARCH BAR (INTEGRATED) */}
// 				{config.showSearchBar && (
// 					<div className="group relative">
// 						<Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
// 						<input
// 							className="w-full rounded-2xl border-none bg-white px-11 py-4 font-medium text-sm shadow-xl outline-none ring-1 ring-black/5 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50"
// 							placeholder="Find answers now"
// 						/>
// 					</div>
// 				)}

// 				{/* ARTICLES SECTION */}
// 				<div className="rounded-2xl bg-white p-5 shadow-xl ring-1 ring-black/5">
// 					<div className="mb-4 flex items-center justify-between">
// 						<h2 className="font-bold text-sm uppercase tracking-tight opacity-50">
// 							Help center
// 						</h2>
// 						<HelpCircle className="h-4 w-4 text-indigo-600" />
// 					</div>

// 					<div className="space-y-1">
// 						{[
// 							{ title: "Getting started with Rovo", time: "5 min read" },
// 							{ title: "Customizing your widget", time: "3 min read" },
// 							{ title: "Managing integrations", time: "8 min read" },
// 						].map((article, i) => (
// 							<button
// 								className="group flex w-full items-center justify-between rounded-xl px-2 py-3 text-left transition hover:bg-slate-50"
// 								key={i}
// 								type="button"
// 							>
// 								<div className="min-w-0">
// 									<p className="line-clamp-1 font-bold text-slate-800 text-sm">
// 										{article.title}
// 									</p>
// 									<p className="mt-0.5 font-semibold text-[11px] text-slate-400">
// 										{article.time}
// 									</p>
// 								</div>
// 								<ChevronRight className="h-4 w-4 text-slate-200 transition-transform group-hover:translate-x-0.5" />
// 							</button>
// 						))}
// 					</div>

// 					<button
// 						className="mt-4 w-full rounded-xl border border-slate-100 py-3 font-bold text-[13px] text-slate-600 transition hover:bg-slate-50 active:scale-95"
// 						type="button"
// 					>
// 						Visit our Help Center
// 					</button>
// 				</div>
// 			</div>

// 			{/* FOOTER */}
// 			<div className="border-slate-100 border-t bg-white px-6 py-4 text-center">
// 				<p className="flex items-center justify-center gap-1.5 font-bold text-[11px] text-slate-300 uppercase tracking-widest">
// 					Powered by{" "}
// 					<span className="text-blue-500 opacity-100">Rovo Desk</span>
// 				</p>
// 			</div>
// 		</div>
// 	);
// }
