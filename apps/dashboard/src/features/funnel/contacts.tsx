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

const ContactsPage = () => {
	const [selectedId, setSelectedId] = useState("1");
	// const selected = contacts.find((c) => c.id === selectedId);

	return (
		<MainContent
			headerLeftContent={
				<div className="relative">
					<Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="h-8 w-64 pl-8 text-xs"
						placeholder="Search contacts..."
					/>
				</div>
			}
			headerRightContent={
				<div className="flex items-center gap-2">
					<Button className="h-8 text-xs" size="lg" variant="outline">
						<Filter className="mr-1.5 h-3.5 w-3.5" /> Filter
					</Button>
					<Button className="h-8 text-foreground text-xs" size="lg">
						<UserPlus className="mr-1.5 h-3.5 w-3.5 text-foreground" /> Add
						Contact
					</Button>
				</div>
			}
			secondaryHeader={<SecondarySidebarTitleHeader title="Funnels " />}
			secondarySections={contactsSections}
		>
			<div className="scrollbar-thin flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
				<table className="w-full">
					<thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
						<tr className="text-left">
							<th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
								Name
							</th>
							<th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
								Company
							</th>
							<th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
								Location
							</th>
							<th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
								Status
							</th>
							<th className="px-4 py-2.5 font-medium text-muted-foreground text-xs">
								Last Seen
							</th>
							<th className="w-10 px-4 py-2.5 font-medium text-muted-foreground text-xs" />
						</tr>
					</thead>
					<tbody>
						{contacts.map((contact) => (
							<tr
								className={cn(
									"cursor-pointer border-border/50 border-b transition-colors",
									selectedId === contact.id
										? "bg-primary/5"
										: "hover:bg-muted/30"
								)}
								key={contact.id}
								onClick={() => setSelectedId(contact.id)}
							>
								<td className="px-4 py-3">
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarFallback
												className="font-medium text-[10px] text-primary-foreground"
												style={{ backgroundColor: contact.avatarColor }}
											>
												{contact.initials}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className="font-medium text-sm">{contact.name}</div>
											<div className="text-muted-foreground text-xs">
												{contact.email}
											</div>
										</div>
									</div>
								</td>
								<td className="px-4 py-3">
									<div className="text-sm">{contact.company}</div>
									<div className="text-muted-foreground text-xs">
										{contact.role}
									</div>
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-1.5 text-muted-foreground text-sm">
										<MapPin className="h-3 w-3" /> {contact.location}
									</div>
								</td>
								<td className="px-4 py-3">
									<Badge
										className={cn(
											"h-5 text-[10px]",
											contact.status === "active" &&
												"bg-success text-success-foreground",
											contact.status === "lead" &&
												"bg-primary text-primary-foreground"
										)}
										variant={
											contact.status === "active" ? "default" : "secondary"
										}
									>
										{contact.status}
									</Badge>
								</td>
								<td className="px-4 py-3 text-muted-foreground text-xs">
									{contact.lastSeen}
								</td>
								<td className="px-4 py-3">
									<Button className="h-7 w-7" size="icon" variant="ghost">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</MainContent>
	);
};

export default ContactsPage;
