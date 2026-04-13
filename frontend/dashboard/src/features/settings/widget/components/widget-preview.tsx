import {
	Avatar,
	AvatarFallback,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type {
	WidgetConfig,
	WidgetMode,
	WidgetTabType,
} from "@zero-heads-lab/shared/lib/types";
import {
	BookOpen,
	ChevronLeft,
	Headphones,
	HelpCircle,
	Megaphone,
	MessageCircle,
	MessageSquare,
	Paperclip,
	Phone,
	Send,
	Smile,
	X,
} from "lucide-react";
import { type Key, useState } from "react";
import { resolveBlocks } from "../utils/blocks";

const iconMap: Record<string, React.ElementType> = {
	"message-circle": MessageCircle,
	"message-square": MessageSquare,
	headphones: Headphones,
	"help-circle": HelpCircle,
};

type PreviewView = "closed" | "home" | "conversation";

export function WidgetPreview({
	className,
	config,
}: {
	className?: string;
	config: WidgetConfig;
}) {
	const [view, setView] = useState<PreviewView>("home");
	const { theme, launcher } = config;
	const LauncherIcon = iconMap[launcher.icon] || MessageCircle;
	const borderRadius = `${theme.borderRadius}px`;

	const blocks = resolveBlocks(config, "user", "conversation");
	const conversationBlock = blocks.find(
		(b: { type: string }) => b.type === "conversation"
	);

	if (!conversationBlock) return null;

	const conversation = conversationBlock.config;

	return (
		<div
			className={cn(
				"relative flex h-svh flex-1 items-center justify-center overflow-hidden bg-muted/30",
				className
			)}
		>
			{/* Browser Frame */}
			<div className="flex h-[600px] w-full max-w-[800px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg">
				{/* Browser Chrome */}
				<div className="flex items-center gap-2 border-border border-b bg-muted/50 px-4 py-2.5">
					<div className="flex gap-1.5">
						<div className="h-3 w-3 rounded-full bg-destructive/60" />
						<div className="h-3 w-3 rounded-full bg-warning/60" />
						<div className="h-3 w-3 rounded-full bg-success/60" />
					</div>
					<div className="mx-8 flex-1">
						<div className="rounded-md border border-border bg-background px-3 py-1 text-center text-muted-foreground text-xs">
							yourwebsite.domain
						</div>
					</div>
				</div>

				{/* Website Content */}
				<div className="relative flex-1 bg-linear-to-br from-muted/20 to-muted/40 p-8">
					{/* Fake website content */}
					<div className="space-y-3 opacity-40">
						<div className="h-6 w-32 rounded bg-border" />
						<div className="h-4 w-64 rounded bg-border" />
						<div className="h-4 w-48 rounded bg-border" />
						<div className="mt-6 h-32 w-full rounded-lg bg-border/50" />
						<div className="h-4 w-56 rounded bg-border" />
						<div className="h-4 w-40 rounded bg-border" />
					</div>

					{/* Widget */}
					<div
						className={`absolute bottom-4 ${launcher.position === "right" ? "right-4" : "left-4"} flex flex-col items-${launcher.position === "right" ? "end" : "start"} gap-3`}
					>
						{view !== "closed" && (
							<div
								className="flex flex-col overflow-hidden"
								style={{
									width: `${Math.min(theme.widgetWidth, 360)}px`,
									height: `${Math.min(theme.widgetHeight, 480)}px`,
									borderRadius,
									backgroundColor: theme.backgroundColor,
									color: theme.textColor,
									boxShadow: theme.shadow
										? "0 8px 40px rgba(0,0,0,0.16)"
										: "0 2px 8px rgba(0,0,0,0.08)",
								}}
							>
								{/* Widget Header */}
								<div
									className="flex shrink-0 items-center gap-3 px-4 py-3"
									style={{ backgroundColor: theme.headerColor }}
								>
									{view === "conversation" && (
										<button
											className="text-white/80 hover:text-white"
											onClick={() => setView("home")}
										>
											<ChevronLeft className="h-4 w-4" />
										</button>
									)}
									{conversation.showAvatar && (
										<Avatar className="h-7 w-7">
											<AvatarFallback
												className="font-bold text-[10px]"
												style={{
													backgroundColor: "rgba(255,255,255,0.2)",
													color: "white",
												}}
											>
												{theme.companyName.charAt(0)}
											</AvatarFallback>
										</Avatar>
									)}
									<div className="min-w-0 flex-1">
										<div className="truncate font-semibold text-sm text-white">
											{view === "conversation"
												? conversation.headerTitle
												: theme.headerTitle}
										</div>
										{view === "home" && (
											<div className="truncate text-[11px] text-white/70">
												{theme.subtitle}
											</div>
										)}
										{view === "conversation" &&
											conversation.showOnlineStatus && (
												<div className="flex items-center gap-1">
													<div className="h-1.5 w-1.5 rounded-full bg-green-400" />
													<span className="text-[10px] text-white/70">
														Online
													</span>
												</div>
											)}
									</div>
									<button
										className="text-white/70 hover:text-white"
										onClick={() => setView("closed")}
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								{/* Widget Body */}
								<div className="scrollbar-thin flex-1 overflow-y-auto">
									{view === "home" ? (
										<HomeView
											config={config}
											onStartConversation={() => setView("conversation")}
										/>
									) : (
										<ConversationView config={config} />
									)}
								</div>
							</div>
						)}

						{/* Launcher */}
						{!config.advanced.hideLauncher && (
							<button
								className="flex items-center gap-2 text-white shadow-lg transition-transform hover:scale-105"
								onClick={() => setView(view === "closed" ? "home" : "closed")}
								style={{
									backgroundColor: theme.primaryColor,
									borderRadius: "50px",
									padding: launcher.showLabel ? "12px 20px" : "14px",
								}}
							>
								{view === "closed" ? (
									<LauncherIcon className="h-5 w-5" />
								) : (
									<X className="h-5 w-5" />
								)}
								{launcher.showLabel && view === "closed" && (
									<span className="font-medium text-sm">
										{launcher.labelText}
									</span>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function HomeView({
	config,
	mode = "visitor",
	onStartConversation,
}: {
	config: WidgetConfig;
	mode?: WidgetMode;
	onStartConversation: () => void;
}) {
	const { theme } = config;

	const blocks = resolveBlocks(config, mode, "welcome");

	return (
		<div className="space-y-3 p-4">
			{blocks
				.filter((b: { enabled: boolean }) => b.enabled)
				.map(
					(block: {
						type: WidgetTabType;
						id: Key | null | undefined;
						config: {
							title: string;
							subtitle: string;
							label: string;
							articleLimit: number;
							text: string;
						};
					}) => {
						switch (block.type) {
							case "welcome":
								return (
									<div className="space-y-1" key={block.id}>
										<p
											className="font-semibold text-sm"
											style={{ color: theme.textColor }}
										>
											{block.config.title as string}
										</p>
										<p
											className="text-xs"
											style={{ color: theme.textColor, opacity: 0.6 }}
										>
											{block.config.subtitle as string}
										</p>
									</div>
								);
							case "conversation":
								return (
									<button
										className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
										key={block.id}
										onClick={onStartConversation}
									>
										<MessageCircle
											className="h-4 w-4"
											style={{ color: theme.primaryColor }}
										/>
										<span
											className="text-sm"
											style={{ color: theme.textColor }}
										>
											{block.config.label as string}
										</span>
									</button>
								);
							case "knowledge_base":
								return (
									<div className="space-y-2" key={block.id}>
										<div className="flex items-center gap-2">
											<BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
											<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
												Help Articles
											</span>
										</div>
										{[1, 2, 3]
											.slice(
												0,
												Math.min((block.config.articleLimit as number) || 3, 3)
											)
											.map((i) => (
												<div
													className="rounded border border-border p-2 text-xs"
													key={i}
													style={{ color: theme.textColor, opacity: 0.7 }}
												>
													Sample article {i}
												</div>
											))}
									</div>
								);
							case "announcement":
								return (
									<div
										className="flex items-center gap-2 rounded-lg p-3"
										key={block.id}
										style={{ backgroundColor: `${theme.primaryColor}15` }}
									>
										<Megaphone
											className="h-4 w-4"
											style={{ color: theme.primaryColor }}
										/>
										<span
											className="text-xs"
											style={{ color: theme.textColor }}
										>
											{(block.config.text as string) || "New feature!"}
										</span>
									</div>
								);
							case "cta":
								return (
									<button
										className="flex w-full items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
										key={block.id}
									>
										<Phone
											className="h-4 w-4"
											style={{ color: theme.primaryColor }}
										/>
										<span
											className="text-xs"
											style={{ color: theme.textColor }}
										>
											{(block.config.text as string) || "Contact Us"}
										</span>
									</button>
								);
							default:
								return null;
						}
					}
				)}
		</div>
	);
}

function ConversationView({ config }: { config: WidgetConfig }) {
	const { theme } = config;
	const blocks = resolveBlocks(config, "user", "conversation");
	const conversationBlock = blocks.find(
		(b: { type: string }) => b.type === "conversation"
	);

	if (!conversationBlock) return null;

	const conversation = conversationBlock.config;

	return (
		<div className="flex h-full flex-col">
			<div className="flex-1 space-y-3 p-3">
				{/* Agent message */}
				<div className="flex items-end gap-2">
					{conversation.showAgentAvatar && (
						<Avatar className="h-6 w-6 shrink-0">
							<AvatarFallback
								className="text-[9px]"
								style={{
									backgroundColor: `${theme.primaryColor}20`,
									color: theme.primaryColor,
								}}
							>
								A
							</AvatarFallback>
						</Avatar>
					)}
					<div
						className="max-w-[75%] px-3 py-2 text-xs"
						style={{
							backgroundColor: conversation.agentBubbleColor,
							borderRadius: theme.borderRadius,
							color: theme.textColor,
						}}
					>
						{conversation.welcomeMessage}
					</div>
				</div>

				{/* User message */}
				<div className="flex justify-end">
					<div
						className="max-w-[75%] px-3 py-2 text-white text-xs"
						style={{
							backgroundColor: conversation.userBubbleColor,
							borderRadius: theme.borderRadius,
						}}
					>
						Hi! I have a question about pricing.
					</div>
				</div>

				{/* Typing indicator */}
				{conversation.showTypingIndicator && (
					<div className="flex items-end gap-2">
						{conversation.showAgentAvatar && (
							<Avatar className="h-6 w-6 shrink-0">
								<AvatarFallback
									className="text-[9px]"
									style={{
										backgroundColor: `${theme.primaryColor}20`,
										color: theme.primaryColor,
									}}
								>
									A
								</AvatarFallback>
							</Avatar>
						)}
						<div
							className="rounded-2xl px-3 py-2"
							style={{ backgroundColor: conversation.agentBubbleColor }}
						>
							<div className="flex gap-1">
								<div
									className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40"
									style={{ animationDelay: "0ms" }}
								/>
								<div
									className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40"
									style={{ animationDelay: "150ms" }}
								/>
								<div
									className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/40"
									style={{ animationDelay: "300ms" }}
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Input */}
			<div className="flex items-center gap-2 border-border border-t p-2">
				{conversation.allowAttachments && (
					<button className="p-1 text-muted-foreground hover:text-foreground">
						<Paperclip className="h-4 w-4" />
					</button>
				)}
				<div className="flex-1 rounded-full bg-muted/50 px-3 py-1.5 text-muted-foreground text-xs">
					{conversation.placeholderText}
				</div>
				{conversation.allowEmojis && (
					<button className="p-1 text-muted-foreground hover:text-foreground">
						<Smile className="h-4 w-4" />
					</button>
				)}
				<button
					className="rounded-full p-1.5"
					style={{ backgroundColor: theme.primaryColor }}
				>
					{conversation.sendButtonStyle === "icon" ? (
						<Send className="h-3.5 w-3.5 text-white" />
					) : (
						<span className="px-1 text-white text-xs">Send</span>
					)}
				</button>
			</div>
		</div>
	);
}
