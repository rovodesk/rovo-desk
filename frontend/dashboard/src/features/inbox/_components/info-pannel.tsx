import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { TooltipProvider } from "@zero-heads-lab/design-system/components/ui/tooltip";
import type { Conversation } from "@zero-heads-lab/shared/lib/types";

import {
	Calendar,
	Clock,
	Copy,
	ExternalLink,
	Globe,
	Laptop,
	type LucideIcon,
	MapPin,
	Monitor,
	ShieldCheck,
	UserCircle,
} from "lucide-react";

interface InfoPanelProps {
	data?: Conversation;
}

export function InfoPanel({ data }: InfoPanelProps) {
	const customer = data?.customer || {
		name: "Indigo Squirrel",
		email: "indigo@company.com",
		initials: "IS",
		plan: "Pro Plan",
		status: "Active",
		company: "Indigo Labs",
		avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka",
		location: { city: "Saalfelden", country: "Austria", tz: "Europe/Vienna" },
		tech: { ip: "111.11.111.111", browser: "Chrome 120", os: "macOS" },
	};

	const copy = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied`);
	};

	return (
		<TooltipProvider>
			<ScrollArea className="h-full w-full">
				<div className="flex flex-col gap-6 p-4">
					{/* Profile */}
					<div className="flex flex-col items-center text-center">
						<Avatar className="h-16 w-16">
							<AvatarImage alt={customer.name} src={customer.avatar} />
							<AvatarFallback className="bg-primary font-semibold text-primary-foreground">
								{customer.initials}
							</AvatarFallback>
						</Avatar>

						<h3 className="mt-3 font-semibold text-sm">{customer.name}</h3>

						<button
							className="mt-1 text-muted-foreground text-xs hover:text-foreground"
							onClick={() => copy(customer.email, "Email")}
						>
							{customer.email}
						</button>

						<div className="mt-3 flex gap-2">
							<Badge variant="outline">{customer.plan}</Badge>
							<Badge variant="secondary">{customer.status}</Badge>
						</div>

						<div className="mt-4 grid w-full grid-cols-2 gap-2">
							<Button className="h-8 text-xs" size="sm" variant="outline">
								<UserCircle className="mr-1 h-3.5 w-3.5" />
								Profile
							</Button>

							<Button className="h-8 text-xs" size="sm" variant="outline">
								<ExternalLink className="mr-1 h-3.5 w-3.5" />
								Funnel
							</Button>
						</div>
					</div>

					<Separator />

					{/* Context */}
					<Section title="Conversation">
						<Row icon={ShieldCheck} label="Priority" value="Critical" />
						<Row icon={Clock} label="Status" value="Awaiting reply" />
					</Section>

					<Separator />

					{/* Attributes */}
					<Section title="Customer">
						<Row
							icon={MapPin}
							label="Location"
							value={`${customer.location.city}, ${customer.location.country}`}
						/>
						<Row icon={Calendar} label="Customer since" value="Jan 2025" />
					</Section>

					<Separator />

					{/* Technical */}
					<Section title="Technical">
						<Row icon={Laptop} label="System" value={customer.tech.os} />
						<Row icon={Globe} label="Browser" value={customer.tech.browser} />
						<Row
							icon={Monitor}
							label="IP Address"
							onCopy={() => copy(customer.tech.ip, "IP")}
							value={customer.tech.ip}
						/>
					</Section>
				</div>
			</ScrollArea>
		</TooltipProvider>
	);
}

/* --------------------- */

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<h4 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
				{title}
			</h4>

			<div className="rounded-md">{children}</div>
		</div>
	);
}

function Row({
	icon: Icon,
	label,
	value,
	onCopy,
}: {
	icon: LucideIcon;
	label: string;
	value: string;
	onCopy?: () => void;
}) {
	return (
		<div className="flex items-center justify-between px-3 py-1.5 text-xs">
			<div className="flex items-center gap-2 text-muted-foreground">
				<Icon className="h-3.5 w-3.5" />
				<span>{label}</span>
			</div>

			<div className="flex items-center gap-2 font-medium">
				<span className="truncate">{value}</span>

				{onCopy && (
					<button
						className="text-muted-foreground hover:text-foreground"
						onClick={onCopy}
					>
						<Copy className="h-3 w-3" />
					</button>
				)}
			</div>
		</div>
	);
}
