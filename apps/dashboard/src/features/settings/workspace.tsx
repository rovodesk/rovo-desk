import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { SectionHeader } from "./_components/section-header";
import SectionMain from "./_components/section-main";

export function WorkspaceSettings() {
	const members = [
		{ name: "John Doe", email: "john@company.com", role: "Admin" },
		{ name: "Sarah Spangenberg", email: "sarah@company.com", role: "Agent" },
		{ name: "Martin Duhamel", email: "martin@company.com", role: "Agent" },
		{ name: "Blair Avinash", email: "blair@company.com", role: "Viewer" },
	];
	return (
		<SectionMain>
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
		</SectionMain>
	);
}
