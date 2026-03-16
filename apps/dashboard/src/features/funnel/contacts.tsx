import {
	Avatar,
	AvatarFallback,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	Building2,
	Filter,
	MapPin,
	MoreHorizontal,
	Search,
	Star,
	UserPlus,
	Users,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useState } from "react";
import { MainContent } from "@/layout/main-content";
import {
	type SecondaryNavSection,
	SecondarySidebarTitleHeader,
} from "@/layout/sidebar/secondary-sidebar";

const contactsSections: SecondaryNavSection[] = [
	{
		title: "Contacts",
		collapsible: false,
		items: [
			{ id: "all-contacts", label: "All Contacts", icon: Users, count: 1284 },
			{ id: "leads", label: "Leads", icon: UserPlus, count: 342 },
			{ id: "customers", label: "Customers", icon: Users, count: 856 },
			{ id: "companies", label: "Companies", icon: Building2, count: 86 },
			{ id: "favorites", label: "Favorites", icon: Star, count: 24 },
		],
	},
	{
		title: "Segments",
		collapsible: true,
		items: [
			{
				id: "enterprise",
				label: "Enterprise",
				dotColor: "hsl(215, 90%, 56%)",
				count: 45,
			},
			{ id: "smb", label: "SMB", dotColor: "hsl(142, 71%, 45%)", count: 234 },
			{
				id: "startup",
				label: "Startup",
				dotColor: "hsl(38, 92%, 50%)",
				count: 178,
			},
			{
				id: "churned",
				label: "Churned",
				dotColor: "hsl(0, 72%, 51%)",
				count: 32,
			},
			{
				id: "trial",
				label: "Free Trial",
				dotColor: "hsl(280, 65%, 55%)",
				count: 89,
			},
		],
	},
	{
		title: "Lists",
		collapsible: true,
		items: [
			{ id: "newsletter", label: "Newsletter", count: 890 },
			{ id: "product-updates", label: "Product Updates", count: 654 },
			{ id: "beta-users", label: "Beta Users", count: 120 },
		],
	},
];

interface Contact {
	id: string;
	name: string;
	email: string;
	company: string;
	role: string;
	location: string;
	status: "active" | "inactive" | "lead";
	lastSeen: string;
	initials: string;
	avatarColor: string;
	phone: string;
}

const contacts: Contact[] = [
	{
		id: "1",
		name: "Indigo Squirrel",
		email: "indigo@company.com",
		company: "TechCorp",
		role: "CTO",
		location: "Saalfelden, Austria",
		status: "active",
		lastSeen: "Just now",
		initials: "IS",
		avatarColor: "hsl(215, 90%, 56%)",
		phone: "+43 123 456 789",
	},
	{
		id: "2",
		name: "Emma Watson",
		email: "emma@design.co",
		company: "DesignCo",
		role: "Lead Designer",
		location: "London, UK",
		status: "active",
		lastSeen: "5m ago",
		initials: "EW",
		avatarColor: "hsl(340, 65%, 55%)",
		phone: "+44 20 1234 5678",
	},
	{
		id: "3",
		name: "James Rodriguez",
		email: "james@startup.io",
		company: "StartupIO",
		role: "CEO",
		location: "Miami, US",
		status: "lead",
		lastSeen: "1h ago",
		initials: "JR",
		avatarColor: "hsl(142, 71%, 45%)",
		phone: "+1 305 123 4567",
	},
	{
		id: "4",
		name: "Sophie Chen",
		email: "sophie@enterprise.com",
		company: "Enterprise Inc",
		role: "VP Engineering",
		location: "San Francisco, US",
		status: "active",
		lastSeen: "2h ago",
		initials: "SC",
		avatarColor: "hsl(38, 92%, 50%)",
		phone: "+1 415 987 6543",
	},
	{
		id: "5",
		name: "Michael Brown",
		email: "michael@agency.com",
		company: "Creative Agency",
		role: "Project Manager",
		location: "New York, US",
		status: "inactive",
		lastSeen: "3d ago",
		initials: "MB",
		avatarColor: "hsl(280, 65%, 55%)",
		phone: "+1 212 555 0123",
	},
	{
		id: "6",
		name: "Lisa Park",
		email: "lisa@fintech.com",
		company: "FinTech Ltd",
		role: "Product Manager",
		location: "Seoul, KR",
		status: "active",
		lastSeen: "30m ago",
		initials: "LP",
		avatarColor: "hsl(0, 72%, 51%)",
		phone: "+82 2 1234 5678",
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.03, // Very fast stagger for long lists
			delayChildren: 0.1,
		},
	},
};

const rowVariants: Variants = {
	hidden: { opacity: 0, x: -4 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { type: "spring", stiffness: 400, damping: 30 },
	},
	exit: { opacity: 0, x: 4, transition: { duration: 0.1 } },
};

const headerItemVariants: Variants = {
	hidden: { opacity: 0, y: -8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 300, damping: 25 },
	},
};

const ContactsPage = () => {
	const [selectedId, setSelectedId] = useState("1");

	return (
		<MainContent
			headerLeftContent={
				<motion.div
					animate="visible"
					initial="hidden"
					variants={headerItemVariants}
				>
					<div className="relative">
						<Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="h-8 w-64 pl-8 text-xs"
							placeholder="Search contacts..."
						/>
					</div>
				</motion.div>
			}
			headerRightContent={
				<motion.div
					animate="visible"
					className="flex items-center gap-2"
					initial="hidden"
					variants={containerVariants}
				>
					<motion.div variants={headerItemVariants}>
						<Button className="h-8 text-xs" size="lg" variant="outline">
							<Filter className="mr-1.5 h-3.5 w-3.5" /> Filter
						</Button>
					</motion.div>
					<motion.div variants={headerItemVariants}>
						<Button className="h-8 text-foreground text-xs" size="lg">
							<UserPlus className="mr-1.5 h-3.5 w-3.5 text-foreground" /> Add
							Contact
						</Button>
					</motion.div>
				</motion.div>
			}
			secondaryHeader={<SecondarySidebarTitleHeader title="Funnels " />}
			secondarySections={contactsSections}
		>
			<div className="scrollbar-thin flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-background">
				<table className="w-full border-separate border-spacing-0">
					<thead className="sticky top-0 z-20 bg-background/80 backdrop-blur-md">
						<tr className="text-left">
							{["Name", "Company", "Location", "Status", "Last Seen", ""].map(
								(h, i) => (
									<th
										className="border-b px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider"
										key={i}
									>
										{h}
									</th>
								)
							)}
						</tr>
					</thead>

					<motion.tbody
						animate="visible"
						initial="hidden"
						variants={containerVariants}
					>
						<AnimatePresence initial={false} mode="popLayout">
							{contacts.map((contact) => (
								<motion.tr
									className={cn(
										"group cursor-pointer border-b outline-none transition-colors",
										selectedId === contact.id
											? "bg-primary/4"
											: "hover:bg-muted/40"
									)}
									key={contact.id}
									layout // Makes re-ordering smooth
									onClick={() => setSelectedId(contact.id)}
									variants={rowVariants}
								>
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<Avatar className="h-9 w-9 border-2 border-background shadow-sm">
												<AvatarFallback
													className="font-semibold text-[10px] text-white"
													style={{ backgroundColor: contact.avatarColor }}
												>
													{contact.initials}
												</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-semibold text-sm tracking-tight">
													{contact.name}
												</span>
												<span className="text-[11px] text-muted-foreground">
													{contact.email}
												</span>
											</div>
										</div>
									</td>

									<td className="px-4 py-3">
										<div className="font-medium text-sm">{contact.company}</div>
										<div className="text-[11px] text-muted-foreground">
											{contact.role}
										</div>
									</td>

									<td className="px-4 py-3">
										<div className="flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
											<MapPin className="h-3 w-3 opacity-70" />{" "}
											{contact.location}
										</div>
									</td>

									<td className="px-4 py-3">
										<Badge
											className={cn(
												"h-5 px-2 font-bold text-[10px] uppercase tracking-tighter",
												contact.status === "active"
													? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
													: "border-blue-500/20 bg-blue-500/10 text-blue-600"
											)}
											variant="outline"
										>
											{contact.status}
										</Badge>
									</td>

									<td className="px-4 py-3 text-muted-foreground text-xs tabular-nums">
										{contact.lastSeen}
									</td>

									<td className="px-4 py-3 text-right">
										<Button
											className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
											size="icon"
											variant="ghost"
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</td>
								</motion.tr>
							))}
						</AnimatePresence>
					</motion.tbody>
				</table>
			</div>
		</MainContent>
	);
};

export default ContactsPage;
