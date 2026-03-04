import {
	Avatar,
	AvatarFallback,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	Archive,
	CheckCheck,
	Clock,
	Filter,
	InfoIcon,
	MessageSquare,
	Star,
} from "lucide-react";
import { useState } from "react";
import { MainContent } from "@/layout/main-content";
import { RightSidebar } from "@/layout/sidebar/right-sidebar";
import {
	type SecondaryNavSection,
	SecondarySidebarTitleHeader,
} from "@/layout/sidebar/secondary-sidebar";
import ConversationInput from "./_components/conversation-input";
import { InfoPanel } from "./_components/info-pannel";

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

interface ConversationItem {
	id: string;
	name: string;
	subject: string;
	preview: string;
	time: string;
	channel: string;
	status: "open" | "closed" | "snoozed";
	starred: boolean;
	initials: string;
	avatarColor: string;
	unreadCount: number;
}

const allConversations: ConversationItem[] = [
	{
		id: "1",
		name: "Emma Watson",
		subject: "Issue with billing",
		preview: "I was charged twice for my subscription last month...",
		time: "5m",
		channel: "Email",
		status: "open",
		starred: true,
		initials: "EW",
		avatarColor: "hsl(340, 65%, 55%)",
		unreadCount: 2,
	},
	{
		id: "2",
		name: "James Rodriguez",
		subject: "Feature request: Dark mode",
		preview: "Would love to see a dark mode option in the app...",
		time: "12m",
		channel: "Chat",
		status: "open",
		starred: false,
		initials: "JR",
		avatarColor: "hsl(215, 90%, 56%)",
		unreadCount: 1,
	},
	{
		id: "3",
		name: "Sophie Chen",
		subject: "Onboarding help needed",
		preview: "Hi, I just signed up and I'm having trouble with...",
		time: "25m",
		channel: "Chat",
		status: "open",
		starred: false,
		initials: "SC",
		avatarColor: "hsl(142, 71%, 45%)",
		unreadCount: 16,
	},
	{
		id: "4",
		name: "Michael Brown",
		subject: "API integration question",
		preview: "We're trying to integrate your API with our system...",
		time: "1h",
		channel: "Email",
		status: "open",
		starred: true,
		initials: "MB",
		avatarColor: "hsl(38, 92%, 50%)",
		unreadCount: 22,
	},
	{
		id: "5",
		name: "Lisa Park",
		subject: "Account deletion request",
		preview: "I'd like to delete my account and all associated...",
		time: "2h",
		channel: "Email",
		status: "snoozed",
		starred: false,
		initials: "LP",
		avatarColor: "hsl(280, 65%, 55%)",
		unreadCount: 48,
	},
	{
		id: "6",
		name: "David Kim",
		subject: "Re: Partnership inquiry",
		preview: "Thanks for getting back to me! We'd love to...",
		time: "3h",
		channel: "Social",
		status: "closed",
		starred: false,
		initials: "DK",
		avatarColor: "hsl(0, 72%, 51%)",
		unreadCount: 69,
	},
];

//TODO: add to user settings
const WARNING_THRESHOLD = 12;
const CRITICAL_THRESHOLD = 24;

const ConversationsPage = () => {
	const [activeConv, setActiveConv] = useState("1");
	const selected = allConversations.find((c) => c.id === activeConv);
	const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
	const handleElevateToIssue = () => {
		toast.success("Conversation elevated to issue", {
			description: "Not implemented yet",
		});
	};

	return (
		<>
			<MainContent
				activeSecondary="all"
				secondaryHeader={<SecondarySidebarTitleHeader title="Inbox" />}
				secondarySearchable
				secondarySections={conversationsSections}
			>
				<div className="flex h-full">
					{/* List */}
					<div className="flex w-96 shrink-0 flex-col border-border border-r bg-background">
						{/* Filter tabs */}
						<div className="flex items-center justify-between border-b px-3 py-2.5">
							<div className="flex items-center gap-2">
								<Badge className="cursor-pointer bg-primary text-primary-foreground text-xs">
									Unassigned
								</Badge>
								<Badge
									className="cursor-pointer text-xs hover:bg-muted"
									variant="outline"
								>
									Open
								</Badge>
								<Badge
									className="cursor-pointer text-xs hover:bg-muted"
									variant="outline"
								>
									All
								</Badge>
							</div>

							<Button className="ml-auto h-8 w-8" size="icon">
								<Filter className="h-3.5 w-3.5" />
							</Button>
						</div>
						<div className="scrollbar-thin flex-1 overflow-y-auto">
							{allConversations.map((conv) => (
								<button
									className={cn(
										"flex w-full items-start gap-3 border-border/50 border-b px-3 py-3 text-left transition-colors",
										activeConv === conv.id
											? "bg-primary/10"
											: "hover:bg-muted/50"
									)}
									key={conv.id}
									onClick={() => setActiveConv(conv.id)}
								>
									<Avatar className="mt-0.5 h-9 w-9 shrink-0">
										<AvatarFallback
											className="font-medium text-[11px] text-primary-foreground"
											style={{ backgroundColor: conv.avatarColor }}
										>
											{conv.initials}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between">
											<span className="truncate font-medium text-sm">
												{conv.name}
											</span>
											<span className="ml-2 shrink-0 text-[11px] text-muted-foreground">
												{conv.time}
											</span>
										</div>
										<div className="mt-0.5 truncate font-medium text-xs">
											{conv.subject}
										</div>
										<div className="mt-0.5 flex items-center justify-between">
											<span className="truncate text-muted-foreground text-xs">
												{conv.preview}
											</span>
											{conv.unreadCount > 0 && (
												<span
													className={cn(
														"ml-2 flex h-4.5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 font-medium text-[10px] text-primary-foreground",
														conv.unreadCount > CRITICAL_THRESHOLD
															? "bg-red-400 font-semibold"
															: // biome-ignore lint/style/noNestedTernary: Need for UI
																conv.unreadCount > WARNING_THRESHOLD
																? "bg-amber-400 font-semibold"
																: "bg-primary font-semibold"
													)}
												>
													{conv.unreadCount}
												</span>
											)}
										</div>
										<div className="mt-1 flex items-center gap-1.5">
											<Badge
												className="h-4 px-1.5 text-[10px]"
												variant="outline"
											>
												{conv.channel}
											</Badge>
											<Badge
												className="h-4 px-1.5 text-[10px]"
												variant={
													conv.status === "open" ? "default" : "secondary"
												}
											>
												{conv.status}
											</Badge>
											{conv.starred && (
												<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
											)}
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Detail */}
					<div className="flex min-w-0 flex-1 flex-col">
						{selected ? (
							<>
								<div className="flex w-full items-center justify-between border-border border-b px-5 py-3">
									<div className="flex flex-col gap-1">
										<h2 className="font-semibold text-base">
											{selected.subject}
										</h2>
										<p className="text-muted-foreground text-xs">
											{selected.name} · via {selected.channel} · {selected.time}{" "}
											ago
										</p>
									</div>

									<div className="flex items-center justify-end gap-1">
										<Button
											className="mr-4 bg-purple-600 text-white"
											onClick={handleElevateToIssue}
											size="lg"
										>
											Elevate To Issue
										</Button>

										<Separator orientation="vertical" />

										<Button size="icon-lg" variant="ghost">
											<Star
												className={cn(
													"h-8 w-8",
													selected.starred && "fill-amber-400 text-amber-400"
												)}
											/>
										</Button>

										<Button size="icon-lg" variant="ghost">
											<Archive className="h-8 w-8" />
										</Button>

										<Button
											onClick={() => setIsRightSidebarOpen((p) => !p)}
											size="icon-lg"
											variant="ghost"
										>
											<InfoIcon className="h-8 w-8" />
										</Button>
									</div>
								</div>

								<div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-5 py-4">
									<div className="flex gap-3">
										<Avatar className="h-8 w-8 shrink-0">
											<AvatarFallback
												className="font-medium text-[10px] text-primary-foreground"
												style={{ backgroundColor: selected.avatarColor }}
											>
												{selected.initials}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="mb-1 flex items-center gap-2">
												<span className="font-medium text-sm">
													{selected.name}
												</span>
												<span className="text-[11px] text-muted-foreground">
													{selected.time} ago
												</span>
											</div>
											<div className="max-w-[85%] rounded-xl bg-primary/10 px-3.5 py-2.5 text-sm leading-relaxed">
												{selected.preview}
											</div>
										</div>
									</div>
								</div>

								{/* Assignment note */}
								<div className="flex justify-center">
									<span className="text-muted-foreground text-xs italic">
										This conversation was assigned to Sarah Spangenberg
									</span>
								</div>

								<ConversationInput />
							</>
						) : (
							<div className="flex flex-1 items-center justify-center text-muted-foreground">
								Select a conversation
							</div>
						)}
					</div>
				</div>
			</MainContent>
			<RightSidebar
				isOpen={isRightSidebarOpen}
				onClose={() => setIsRightSidebarOpen(false)}
			>
				<InfoPanel />
			</RightSidebar>
		</>
	);
};

export default ConversationsPage;
