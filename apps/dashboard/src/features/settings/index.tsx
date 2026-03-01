import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import {
	Bell,
	CreditCard,
	Globe,
	KeyRound,
	Palette,
	Plug,
	Shield,
	User,
	Users,
} from "lucide-react";
import type { SecondaryNavSection } from "@/components/sidebar/secondary-sidebar";
import { useDashboardLayout } from "@/layout";
import { MainContent } from "@/layout/main-content";

const settingsSections: SecondaryNavSection[] = [
	{
		title: "Account",
		collapsible: false,
		items: [
			{ id: "profile", label: "Profile", icon: User },
			{ id: "notifications", label: "Notifications", icon: Bell },
			{ id: "security", label: "Security", icon: Shield },
		],
	},
	{
		title: "Workspace",
		collapsible: false,
		items: [
			{ id: "general", label: "General", icon: Globe },
			{ id: "appearance", label: "Appearance", icon: Palette },
			{ id: "team", label: "Team Members", icon: Users },
			{ id: "billing", label: "Billing", icon: CreditCard },
		],
	},
	{
		title: "Integrations",
		collapsible: false,
		items: [
			{ id: "integrations", label: "Connected Apps", icon: Plug },
			{ id: "api", label: "API Keys", icon: KeyRound },
		],
	},
];

function SettingsContent() {
	const { activeSecondarySidebar } = useDashboardLayout();

	return (
		<div className="scrollbar-thin max-w-3xl flex-1 overflow-y-auto p-6">
			{activeSecondarySidebar === "profile" && <ProfileSettings />}
			{activeSecondarySidebar === "notifications" && <NotificationSettings />}
			{activeSecondarySidebar === "security" && <SecuritySettings />}
			{activeSecondarySidebar === "general" && <GeneralSettings />}
			{activeSecondarySidebar === "appearance" && <AppearanceSettings />}
			{activeSecondarySidebar === "team" && <TeamSettings />}
			{activeSecondarySidebar === "billing" && <BillingSettings />}
			{activeSecondarySidebar === "integrations" && <IntegrationsSettings />}
			{activeSecondarySidebar === "api" && <ApiSettings />}
		</div>
	);
}

function SectionHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="mb-6">
			<h2 className="font-semibold text-lg">{title}</h2>
			<p className="mt-1 text-muted-foreground text-sm">{description}</p>
		</div>
	);
}

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between py-4">
			<div>
				<div className="font-medium text-sm">{label}</div>
				{description && (
					<div className="mt-0.5 text-muted-foreground text-xs">
						{description}
					</div>
				)}
			</div>
			{children}
		</div>
	);
}

function ProfileSettings() {
	return (
		<>
			<SectionHeader
				description="Manage your personal information and preferences."
				title="Profile"
			/>
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-xs">First Name</Label>
						<Input className="mt-1.5" defaultValue="John" />
					</div>
					<div>
						<Label className="text-xs">Last Name</Label>
						<Input className="mt-1.5" defaultValue="Doe" />
					</div>
				</div>
				<div>
					<Label className="text-xs">Email</Label>
					<Input className="mt-1.5" defaultValue="john@company.com" />
				</div>
				<div>
					<Label className="text-xs">Role</Label>
					<Input className="mt-1.5" defaultValue="Customer Success Manager" />
				</div>
				<Button className="mt-2 bg-primary text-primary-foreground">
					Save Changes
				</Button>
			</div>
		</>
	);
}

function NotificationSettings() {
	return (
		<>
			<SectionHeader
				description="Choose what notifications you receive."
				title="Notifications"
			/>
			<div className="divide-y divide-border">
				<SettingRow
					description="Get notified about new conversations"
					label="Email notifications"
				>
					<Switch defaultChecked />
				</SettingRow>
				<SettingRow
					description="Browser push notifications"
					label="Push notifications"
				>
					<Switch defaultChecked />
				</SettingRow>
				<SettingRow
					description="Play a sound for new messages"
					label="Sound alerts"
				>
					<Switch />
				</SettingRow>
				<SettingRow
					description="Receive a weekly summary email"
					label="Weekly digest"
				>
					<Switch defaultChecked />
				</SettingRow>
			</div>
		</>
	);
}

function SecuritySettings() {
	return (
		<>
			<SectionHeader
				description="Manage your account security settings."
				title="Security"
			/>
			<div className="space-y-4">
				<div>
					<Label className="text-xs">Current Password</Label>
					<Input className="mt-1.5" type="password" />
				</div>
				<div>
					<Label className="text-xs">New Password</Label>
					<Input className="mt-1.5" type="password" />
				</div>
				<div>
					<Label className="text-xs">Confirm Password</Label>
					<Input className="mt-1.5" type="password" />
				</div>
				<Button className="bg-primary text-primary-foreground">
					Update Password
				</Button>
			</div>
			<Separator className="my-6" />
			<div className="divide-y divide-border">
				<SettingRow
					description="Add an extra layer of security"
					label="Two-factor authentication"
				>
					<Switch />
				</SettingRow>
				<SettingRow
					description="Auto-logout after 30 minutes of inactivity"
					label="Session timeout"
				>
					<Switch defaultChecked />
				</SettingRow>
			</div>
		</>
	);
}

function GeneralSettings() {
	return (
		<>
			<SectionHeader description="Workspace-wide settings." title="General" />
			<div className="space-y-4">
				<div>
					<Label className="text-xs">Workspace Name</Label>
					<Input className="mt-1.5" defaultValue="My CRM Workspace" />
				</div>
				<div>
					<Label className="text-xs">Timezone</Label>
					<Input className="mt-1.5" defaultValue="Europe/Vienna (UTC+1)" />
				</div>
				<div>
					<Label className="text-xs">Language</Label>
					<Input className="mt-1.5" defaultValue="English" />
				</div>
				<Button className="bg-primary text-primary-foreground">Save</Button>
			</div>
		</>
	);
}

function AppearanceSettings() {
	return (
		<>
			<SectionHeader
				description="Customize the look and feel."
				title="Appearance"
			/>
			<div className="divide-y divide-border">
				<SettingRow
					description="Use smaller spacing and font sizes"
					label="Compact mode"
				>
					<Switch />
				</SettingRow>
				<SettingRow
					description="Display user avatars in conversation lists"
					label="Show avatars"
				>
					<Switch defaultChecked />
				</SettingRow>
				<SettingRow
					description="Show message previews in the list"
					label="Conversation previews"
				>
					<Switch defaultChecked />
				</SettingRow>
			</div>
		</>
	);
}

function TeamSettings() {
	const members = [
		{ name: "John Doe", email: "john@company.com", role: "Admin" },
		{ name: "Sarah Spangenberg", email: "sarah@company.com", role: "Agent" },
		{ name: "Martin Duhamel", email: "martin@company.com", role: "Agent" },
		{ name: "Blair Avinash", email: "blair@company.com", role: "Viewer" },
	];
	return (
		<>
			<SectionHeader
				description="Manage who has access to your workspace."
				title="Team Members"
			/>
			<Button className="mb-4 bg-primary text-primary-foreground" size="sm">
				Invite Member
			</Button>
			<div className="divide-y divide-border">
				{members.map((m) => (
					<div className="flex items-center justify-between py-3" key={m.email}>
						<div>
							<div className="font-medium text-sm">{m.name}</div>
							<div className="text-muted-foreground text-xs">{m.email}</div>
						</div>
						<Badge className="text-xs" variant="secondary">
							{m.role}
						</Badge>
					</div>
				))}
			</div>
		</>
	);
}

function BillingSettings() {
	return (
		<>
			<SectionHeader
				description="Manage your subscription and payment methods."
				title="Billing"
			/>
			<div className="mb-4 rounded-lg border border-border p-4">
				<div className="flex items-center justify-between">
					<div>
						<div className="font-semibold text-sm">Pro Plan</div>
						<div className="text-muted-foreground text-xs">
							$49/month · Billed monthly
						</div>
					</div>
					<Badge className="bg-success text-success-foreground">Active</Badge>
				</div>
			</div>
			<div className="space-y-3 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Next billing date</span>
					<span className="font-medium">March 28, 2026</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Payment method</span>
					<span className="font-medium">Visa •••• 4242</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Seats used</span>
					<span className="font-medium">4 / 10</span>
				</div>
			</div>
			<div className="mt-4 flex gap-2">
				<Button size="sm" variant="outline">
					Change Plan
				</Button>
				<Button size="sm" variant="outline">
					Update Payment
				</Button>
			</div>
		</>
	);
}

function IntegrationsSettings() {
	const integrations = [
		{ name: "Slack", status: "Connected", color: "hsl(142, 71%, 45%)" },
		{ name: "Intercom", status: "Connected", color: "hsl(215, 90%, 56%)" },
		{ name: "Stripe", status: "Not connected", color: "hsl(220, 10%, 46%)" },
		{
			name: "Salesforce",
			status: "Not connected",
			color: "hsl(220, 10%, 46%)",
		},
		{ name: "HubSpot", status: "Not connected", color: "hsl(220, 10%, 46%)" },
	];
	return (
		<>
			<SectionHeader
				description="Manage your third-party integrations."
				title="Connected Apps"
			/>
			<div className="divide-y divide-border">
				{integrations.map((i) => (
					<div className="flex items-center justify-between py-3" key={i.name}>
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
								<Plug className="h-4 w-4 text-muted-foreground" />
							</div>
							<div>
								<div className="font-medium text-sm">{i.name}</div>
								<div className="text-xs" style={{ color: i.color }}>
									{i.status}
								</div>
							</div>
						</div>
						<Button className="text-xs" size="sm" variant="outline">
							{i.status === "Connected" ? "Disconnect" : "Connect"}
						</Button>
					</div>
				))}
			</div>
		</>
	);
}

function ApiSettings() {
	return (
		<>
			<SectionHeader
				description="Manage API keys for programmatic access."
				title="API Keys"
			/>
			<div className="mb-4 rounded-lg border border-border p-4">
				<div className="flex items-center justify-between">
					<div>
						<div className="text-muted-foreground text-xs">Production Key</div>
						<code className="font-mono text-sm">crm_live_••••••••••••k7x9</code>
					</div>
					<Button className="text-xs" size="sm" variant="outline">
						Regenerate
					</Button>
				</div>
			</div>
			<div className="rounded-lg border border-border p-4">
				<div className="flex items-center justify-between">
					<div>
						<div className="text-muted-foreground text-xs">Test Key</div>
						<code className="font-mono text-sm">crm_test_••••••••••••m3p5</code>
					</div>
					<Button className="text-xs" size="sm" variant="outline">
						Regenerate
					</Button>
				</div>
			</div>
		</>
	);
}

const SettingsPage = () => {
	return (
		<MainContent secondarySections={settingsSections}>
			<SettingsContent />
		</MainContent>
	);
};

export default SettingsPage;
