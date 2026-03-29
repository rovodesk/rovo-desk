import { IconClockFilled } from "@tabler/icons-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zero-heads-lab/design-system/components/empty";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { TooltipProvider } from "@zero-heads-lab/design-system/components/ui/tooltip";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type { ConversationItem } from "@zero-heads-lab/shared/types";
import {
	Archive,
	ArrowRight,
	CheckCheck,
	ChevronsUpDownIcon,
	Clock,
	Edit,
	Inbox,
	InfoIcon,
	type LucideIcon,
	MessageSquare,
	Search,
	Star,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useMemo, useState } from "react";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import allConversations from "@/data/conversations.json";
import { useDashboardLayout } from "@/layout";
import { MainContent } from "@/layout/main-content";
import { RightSidebar } from "@/layout/sidebar/right-sidebar";
import {
	type SecondaryNavSection,
	SecondarySidebarTitleHeader,
} from "@/layout/sidebar/secondary-sidebar";
import ConversationInput from "./_components/conversation-input";
import { InfoPanel } from "./_components/info-pannel";
import { NewChat } from "./_components/new-chat";

const conversationsSections: SecondaryNavSection[] = [
	{
		title: "Views",
		collapsible: false,
		items: [
			{ id: "all", label: "All Conversations", icon: MessageSquare, count: 48 },
			{ id: "open", label: "Open", icon: MessageSquare, count: 12 },
			{ id: "closed", label: "Closed", icon: CheckCheck, count: 36 },
			{ id: "starred", label: "Starred", icon: Star, count: 5 },
			{ id: "archived", label: "Archived", icon: Archive },
			{ id: "snoozed", label: "Snoozed", icon: Clock, count: 3 },
		],
	},
	{
		title: "Channels",
		collapsible: true,
		items: [
			{ id: "email", label: "Email", dotColor: "hsl(38, 92%, 50%)", count: 18 },
			{
				id: "chat",
				label: "Live Chat",
				dotColor: "hsl(142, 71%, 45%)",
				count: 9,
			},
			{
				id: "social",
				label: "Social Media",
				dotColor: "hsl(215, 90%, 56%)",
				count: 14,
			},
			{ id: "phone", label: "Phone", dotColor: "hsl(280, 65%, 55%)", count: 7 },
		],
	},
	{
		title: "Tags",
		collapsible: true,
		items: [
			{
				id: "bug",
				label: "Bug Report",
				dotColor: "hsl(0, 72%, 51%)",
				count: 4,
			},
			{
				id: "feature",
				label: "Feature Request",
				dotColor: "hsl(215, 90%, 56%)",
				count: 8,
			},
			{
				id: "billing",
				label: "Billing",
				dotColor: "hsl(38, 92%, 50%)",
				count: 3,
			},
			{
				id: "onboarding",
				label: "Onboarding",
				dotColor: "hsl(142, 71%, 45%)",
				count: 6,
			},
		],
	},
];

// Update your variants
const listVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.04,
			delayChildren: 0.1,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 30,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: 0.1 },
	},
};

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		x: -20,
		transition: { duration: 0.2 },
	},
};

const messageVariants: Variants = {
	hidden: (isAgent: boolean) => ({
		opacity: 0,
		scale: 0.8,
		rotate: isAgent ? 2 : -2,
		x: isAgent ? 10 : -10,
		transformOrigin: isAgent ? "right bottom" : "left bottom",
	}),
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		x: 0,
		transition: {
			type: "spring",
			stiffness: 350,
			damping: 25,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: { duration: 0.15 },
	},
};

//TODO: add to user settings
const WARNING_THRESHOLD = 12;
// const CRITICAL_THRESHOLD = 24;

const ConversationsPage = () => {
	const { rightSidebarOpen, setRightSidebarOpen } = useDashboardLayout();

	const [activeConv, setActiveConv] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("all");
	const [sortBy, setSortBy] = useState<
		"newest" | "oldest" | "unread" | "priority"
	>("newest");
	const [createConversationDialogOpened, setCreateConversationDialog] =
		useState(false);

	// 1. Data Logic: Filter and Search
	const filteredConversations = useMemo(() => {
		const filtered = allConversations.conversations.filter((conv) => {
			const matchesSearch =
				conv?.participants[0]?.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				conv.subject.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesFilter =
				activeFilter === "all" ||
				conv.status === activeFilter ||
				(activeFilter === "starred" && conv.starred);

			return matchesSearch && matchesFilter;
		});

		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "newest":
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);

				case "oldest":
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);

				case "unread":
					return b.unreadCount - a.unreadCount;

				case "priority":
					return Number(b.starred) - Number(a.starred);

				default:
					return 0;
			}
		});

		return sorted;
	}, [searchQuery, activeFilter, sortBy]);

	const selected = useMemo(
		() => allConversations.conversations.find((c) => c.id === activeConv),
		[activeConv]
	);

	const handleElevateToIssue = () => {
		toast.success("Conversation elevated to issue", {
			description: "Ticket created in Engineering backlog.",
		});
	};

	return (
		<>
			<MainContent
				secondaryHeader={
					<SecondarySidebarTitleHeader
						action={() => setCreateConversationDialog(true)}
						actionIcon={Edit}
						title="Inbox"
					/>
				}
				secondarySections={conversationsSections}
				showHeader={false}
			>
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="flex h-full"
					exit={{ opacity: 0, y: 20 }}
					initial={{ opacity: 0, y: 20 }}
					transition={{
						duration: 0.6,
						ease: [0.25, 1, 0.5, 1],
					}}
				>
					{/* --- Sidebar List --- */}
					<div className="flex w-96 shrink-0 flex-col border-border border-r bg-background/50 backdrop-blur-sm">
						<div className="space-y-4 p-4">
							{/* Breadcrumb and Dropdown */}
							<div className="flex items-center justify-between">
								<DynamicBreadcrumb className="ml-1" />
								{/* Sort Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											aria-label="Sort conversations"
											className="size-8"
											size="icon"
											title={`Sort: ${sortBy}`}
											variant="ghost"
										>
											<ChevronsUpDownIcon className="text-muted-foreground" />
										</Button>
									</DropdownMenuTrigger>

									<DropdownMenuContent
										align="start"
										alignOffset={12}
										className="w-44 space-y-1 p-2"
										side="right"
										sideOffset={10}
									>
										<DropdownMenuLabel className="text-muted-foreground text-xs">
											Sort conversations
										</DropdownMenuLabel>

										{[
											{ value: "newest", label: "Newest first", icon: Clock },
											{ value: "oldest", label: "Oldest first", icon: Clock },
											{ value: "unread", label: "Unread first", icon: Inbox },
											{
												value: "priority",
												label: "Priority first",
												icon: Star,
											},
										].map((item, idx) => {
											const Icon = item.icon;
											const active = sortBy === item.value;

											return (
												<motion.div
													key={idx}
													whileHover={{ scale: 1.03 }}
													whileTap={{ scale: 0.97 }}
												>
													<DropdownMenuItem
														className={cn(
															"flex items-center gap-2 rounded-md text-sm",
															active && "bg-primary/10 text-primary"
														)}
														key={item.value}
														onClick={() =>
															setSortBy(item.value as typeof sortBy)
														}
													>
														<Icon className="h-4 w-4" />

														<span className="flex-1">{item.label}</span>

														{active && <CheckCheck className="h-4 w-4" />}
													</DropdownMenuItem>
												</motion.div>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							{/* Search */}
							<div className="relative">
								<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									className="h-9 bg-muted/50 pl-9"
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search by name or subject..."
									value={searchQuery}
								/>
							</div>

							{/* Filters */}
							<div className="relative flex gap-1 rounded-xl border border-border/50 bg-muted/50 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
								{["all", "open", "pending", "closed"].map((f) => {
									const isActive = activeFilter === f;
									return (
										<button
											className={cn(
												"relative z-10 h-7 flex-1 font-medium text-[11px] capitalize transition-colors duration-200",
												isActive
													? "text-white"
													: "text-muted-foreground hover:text-foreground"
											)}
											key={f}
											onClick={() => setActiveFilter(f)}
										>
											{/* The Label */}
											<span className="relative z-20">{f}</span>

											{/* The Sliding Background */}
											{isActive && (
												<motion.div
													className="absolute inset-0 z-10 rounded-lg bg-blue-600/80 shadow-sm ring-1 ring-black/5"
													layoutId="activeTab"
													transition={{
														type: "spring",
														stiffness: 400,
														damping: 30,
													}}
												/>
											)}
										</button>
									);
								})}
							</div>
						</div>

						{/* Chat lists */}
						<div className="scrollbar-none flex-1 overflow-y-auto">
							<motion.div
								animate="visible" // KEY IS VITAL: Re-triggers stagger on change
								initial="hidden"
								key={`${activeFilter}-${sortBy}`}
								variants={listVariants}
							>
								{filteredConversations.length > 0 ? (
									<AnimatePresence initial={false} mode="popLayout">
										{filteredConversations.map((conv) => (
											<motion.button
												animate="visible"
												className={cn(
													"flex w-full flex-col gap-1 border-border/40 border-b px-4 py-4 text-left transition-colors",
													activeConv === conv.id
														? "bg-primary/5 ring-1 ring-primary/20 ring-inset"
														: "hover:bg-muted/30"
												)}
												exit="exit"
												initial="hidden"
												key={conv.id}
												layout
												onClick={() => setActiveConv(conv.id)}
												variants={itemVariants}
												whileTap={{ scale: 0.97 }}
											>
												<div className="flex items-center justify-between gap-2">
													<div className="flex min-w-0 items-center gap-2">
														<Avatar className="h-7 w-7">
															<AvatarImage
																alt={conv?.participants[0]?.name}
																src={conv?.participants[0]?.avatar || ""}
															/>
															<AvatarFallback
																className="text-[10px] text-white"
																style={{
																	backgroundColor:
																		conv?.participants[0]?.avatarColor,
																}}
															>
																{conv?.participants[0]?.initials}
															</AvatarFallback>
														</Avatar>
														<span className="truncate font-semibold text-sm">
															{conv?.participants[0]?.name}
														</span>
													</div>
													<span className="whitespace-nowrap text-[10px] text-muted-foreground">
														{new Date(conv.createdAt).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</span>
												</div>

												<div className="min-w-0 pl-9">
													<p className="mb-0.5 truncate font-medium text-xs">
														{conv.subject}
													</p>
													<p className="truncate text-[11px] text-muted-foreground leading-relaxed">
														{conv.preview}
													</p>

													<div className="mt-2 flex items-center justify-between">
														<div className="flex items-center gap-1.5">
															<Badge
																className="h-4 px-1 text-[9px] uppercase tracking-wider"
																variant="outline"
															>
																{conv.channel}
															</Badge>
															{conv.starred && (
																<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
															)}
														</div>
														{conv.unreadCount > 0 && (
															<Badge
																className={cn(
																	"h-4 min-w-4 rounded-full px-1 text-[10px]",
																	conv.unreadCount > WARNING_THRESHOLD
																		? "bg-orange-500"
																		: "bg-primary"
																)}
															>
																{conv.unreadCount}
															</Badge>
														)}
													</div>
												</div>
											</motion.button>
										))}
									</AnimatePresence>
								) : (
									<div className="flex flex-col items-center justify-center px-4 py-12 text-center">
										<div className="mb-3 rounded-full bg-muted p-3">
											<Search className="h-5 w-5 text-muted-foreground" />
										</div>
										<p className="font-medium text-sm">
											No conversations found
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											Try adjusting your filters or search terms.
										</p>
									</div>
								)}
							</motion.div>
						</div>
					</div>

					{/* --- Detail View --- */}
					<div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
						<AnimatePresence mode="wait">
							{selected ? (
								<motion.div
									animate="visible"
									className="flex min-w-0 flex-1 flex-col bg-background"
									exit="exit"
									initial="hidden"
									key={selected.id}
									transition={{ duration: 0.25 }}
									variants={containerVariants}
								>
									<motion.div
										className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 px-6 py-4 backdrop-blur-md"
										variants={itemVariants}
									>
										{/* Header Info */}
										<div className="min-w-0">
											<div className="mb-1 flex items-center gap-2">
												<h2 className="truncate font-bold text-lg leading-tight">
													{selected.subject}
												</h2>
												<Badge className="capitalize" variant="secondary">
													{selected.status}
												</Badge>
											</div>
											<p className="flex items-center gap-2 text-muted-foreground text-xs">
												<span className="font-medium text-foreground">
													{selected?.participants[0]?.name}
												</span>
												<span>•</span>
												<span>{selected.customer.location}</span>
												<span>•</span>
												<span>{selected.customer.company}</span>
											</p>
										</div>

										{/* Action Buttons */}
										<div className="flex items-center gap-2">
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button
													className="hidden gap-2 border-green-200 bg-green-50/50 text-green-600 hover:bg-green-50 md:flex"
													size="sm"
													variant="outline"
												>
													<IconClockFilled className="h-4 w-4" />
													Active
												</Button>
											</motion.div>
											<motion.div
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
											>
												<Button
													className="bg-purple-600 hover:bg-purple-700"
													onClick={handleElevateToIssue}
													size="sm"
												>
													Elevate
												</Button>
											</motion.div>
											<Separator className="mx-1 h-8" orientation="vertical" />
											<TooltipProvider>
												<div className="flex items-center gap-1">
													<ActionButton active={selected.starred} icon={Star} />
													<ActionButton icon={Archive} />
													<ActionButton
														active={rightSidebarOpen}
														icon={InfoIcon}
														onClick={() =>
															setRightSidebarOpen(!rightSidebarOpen)
														}
													/>
												</div>
											</TooltipProvider>
										</div>
									</motion.div>

									<div className="flex-1 space-y-6 overflow-y-auto scroll-smooth bg-muted/5 p-6">
										<AnimatePresence initial={false}>
											{/* Conversation History */}
											{selected.messages.map((msg: ConversationItem) => (
												<motion.div
													animate="visible"
													className={cn(
														"flex gap-3",
														msg.sender.role === "agent" && "flex-row-reverse"
													)}
													custom={msg.sender.role === "agent"}
													exit="exit"
													initial="hidden"
													key={msg.id}
													layout
													variants={messageVariants}
												>
													{/* Avatar */}
													<motion.div
														className="mt-1 shrink-0"
														whileHover={{ scale: 1.1 }}
													>
														<Avatar className="mt-1 h-8 w-8">
															<AvatarImage
																alt={msg.sender.name}
																src={msg.sender.avatar}
															/>
															<AvatarFallback className="text-[10px]">
																{msg.sender.name.substring(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
													</motion.div>
													{/* Message */}
													<div
														className={cn(
															"flex max-w-[75%] flex-col",
															msg.sender.role === "agent"
																? "items-end"
																: "items-start"
														)}
													>
														{/* Timestamp only shows on hover of the group to reduce noise */}
														<motion.div
															className="mb-1 flex items-center gap-2 px-1"
															initial={{ opacity: 0 }}
															whileHover={{ opacity: 1 }}
														>
															<span className="font-medium text-[10px] text-muted-foreground uppercase tracking-tight">
																{msg.sender.name} • 10:42 AM
															</span>
														</motion.div>

														{/* Message */}
														<motion.div
															className={cn(
																"relative rounded-2xl px-4 py-2.5 text-sm transition-all",
																// Apply the border/background here directly
																msg.sender.role === "agent"
																	? "rounded-tr-none bg-primary text-primary-foreground shadow-primary/20 shadow-sm"
																	: "rounded-tl-none border border-border bg-muted text-muted- shadow-sm dark:bg-white dark:text-black"
															)}
															layoutId={`bubble-${msg.id}`}
														>
															{/* Content stays on top */}
															<span className="relative z-10 block">
																{msg.content.text}
															</span>

															<div
																className={cn(
																	"pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
																	msg.sender.role === "agent"
																		? "opacity-40"
																		: "opacity-100"
																)}
															>
																{/* The Gloss Gradient
																<div
																	className={cn(
																		"absolute inset-0 bg-linear-to-b",
																		msg.sender.role === "agent"
																			? "from-white/20 to-transparent"
																			: "from-black/2 to-transparent dark:from-white/8"
																	)}
																/> */}

																{/* The inner 'rim' light - this replaces the ring to avoid the corner line glitch */}
																<div
																	className={cn(
																		"absolute inset-0 rounded-[inherit] border border-transparent",
																		msg.sender.role === "agent"
																			? "border-t-white/20 border-l-white/10"
																			: "dark:border-t-white/10 dark:border-l-white/5"
																	)}
																/>
															</div>
														</motion.div>
													</div>
												</motion.div>
											))}
										</AnimatePresence>

										{/* System Event Divider */}
										<motion.div
											className="flex items-center gap-4 py-4"
											variants={itemVariants}
										>
											<Separator className="flex-1" />
											<span className="rounded bg-muted px-2 py-0.5 font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
												System Event
											</span>
											<Separator className="flex-1" />
										</motion.div>

										<p className="text-center text-muted-foreground text-xs italic">
											Conversation assigned to{" "}
											<span className="font-medium text-foreground">
												{selected.assignee.name}
											</span>
										</p>
									</div>

									<motion.div
										className="border-t bg-background p-4"
										variants={itemVariants}
									>
										<ConversationInput />
									</motion.div>
								</motion.div>
							) : (
								<EmptyConversationState />
							)}
						</AnimatePresence>
					</div>
				</motion.div>
			</MainContent>

			{/* Right Sidebar */}
			<RightSidebar
				headerContent={
					<div className="flex items-center gap-2">
						<Button size="icon-lg" variant="ghost">
							<InfoIcon className="h-8 w-8" />
						</Button>
						<span className="font-medium text-sm">User Info</span>
					</div>
				}
			>
				<InfoPanel />
			</RightSidebar>

			{/* New Chat Dialog */}
			<NewChat
				conversations={allConversations.conversations}
				onOpenChange={setCreateConversationDialog}
				open={createConversationDialogOpened}
			/>
		</>
	);
};

const ActionButton = ({
	icon: Icon,
	active,
	onClick,
}: {
	icon: LucideIcon;
	active?: boolean;
	onClick?: () => void;
}) => (
	<motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
		<Button
			className={cn(
				"h-9 w-9",
				active && "bg-primary/10 text-primary hover:bg-primary/20"
			)}
			onClick={onClick}
			size="icon"
			variant="ghost"
		>
			<Icon
				className={cn(
					"h-5 w-5",
					active && Icon === Star && "fill-amber-400 text-amber-400"
				)}
			/>
		</Button>
	</motion.div>
);

export function EmptyConversationState() {
	return (
		<motion.div
			animate="visible"
			className="flex flex-1 items-center justify-center bg-muted/5"
			initial="hidden"
			variants={containerVariants}
		>
			<Empty className="max-w-md">
				<EmptyHeader>
					<motion.div className="flex justify-center" variants={itemVariants}>
						<div className="relative">
							{/* Decorative ambient glow */}
							<div className="absolute -inset-4 rounded-full bg-primary/5 blur-2xl" />
							<EmptyMedia
								className="relative border bg-background shadow-sm"
								variant="icon"
							>
								<Inbox className="h-6 w-6 text-primary" />
							</EmptyMedia>
						</div>
					</motion.div>

					<motion.div variants={itemVariants}>
						<EmptyTitle className="text-xl tracking-tight">
							Select a conversation
						</EmptyTitle>
						<EmptyDescription className="mx-auto max-w-70">
							Pick a thread from the sidebar to manage customer inquiries and
							tickets.
						</EmptyDescription>
					</motion.div>
				</EmptyHeader>

				<motion.div
					className="mt-2 grid grid-cols-2 gap-4"
					variants={itemVariants}
				>
					{[
						{ label: "Unassigned", value: "12", color: "bg-orange-500" },
						{ label: "Open Tickets", value: "48", color: "bg-blue-500" },
					].map((stat, i) => (
						<div
							className="group relative rounded-xl border bg-background/50 p-4 transition-all hover:border-primary/20 hover:shadow-md"
							key={i}
						>
							<div
								className={cn(
									"absolute top-3 right-3 size-1.5 rounded-full",
									stat.color
								)}
							/>
							<p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
								{stat.label}
							</p>
							<p className="mt-1 font-bold text-2xl tracking-tighter">
								{stat.value}
							</p>
						</div>
					))}
				</motion.div>

				<motion.div className="mt-6" variants={itemVariants}>
					<Button
						className="text-muted-foreground transition-colors hover:text-foreground"
						size="sm"
						variant="ghost"
					>
						<span>View keyboard shortcuts</span>
						<kbd className="ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex">
							<span className="text-xs">⌘</span>K
						</kbd>
						<ArrowRight className="ml-2 h-3 w-3 opacity-50" />
					</Button>
				</motion.div>
			</Empty>
		</motion.div>
	);
}

export default ConversationsPage;
