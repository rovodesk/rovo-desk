import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
import { Import, Trash } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "./_components/section-header";
import SectionMain from "./_components/section-main";

export function WorkspaceSettings() {
	const [members, setMembers] = useState([
		{ name: "John Doe", email: "john@company.com", role: "Admin" },
		{ name: "Sarah Spangenberg", email: "sarah@company.com", role: "Agent" },
		{ name: "Martin Duhamel", email: "martin@company.com", role: "Agent" },
		{ name: "Blair Avinash", email: "blair@company.com", role: "Viewer" },
	]);

	const updateRole = (email: string, role: string) => {
		setMembers((prev) =>
			prev.map((m) => (m.email === email ? { ...m, role } : m))
		);
	};

	return (
		<SectionMain>
			<SectionHeader
				description="Manage your workspace members and roles."
				title="Workspace"
			>
				<div className="flex items-center gap-2">
					<Button size="sm">Invite Member</Button>
					<Button size="sm" variant="outline">
						<Import className="mr-2 h-4 w-4" />
						Import
					</Button>
				</div>
			</SectionHeader>

			<div className="overflow-hidden rounded-md border border-border">
				{members.map((m) => (
					<div
						className="flex items-center justify-between border-border border-b px-4 py-3 last:border-b-0 hover:bg-muted/40"
						key={m.email}
					>
						{/* Member info */}
						<div className="flex flex-col">
							<span className="font-medium text-sm">{m.name}</span>
							<span className="text-muted-foreground text-xs">{m.email}</span>
						</div>

						{/* Role + Actions */}
						<div className="flex items-center gap-3">
							<Select
								onValueChange={(value) => updateRole(m.email, value)}
								value={m.role}
							>
								<SelectTrigger className="h-8 w-[120px] text-xs">
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="Admin">Admin</SelectItem>
									<SelectItem value="Agent">Agent</SelectItem>
									<SelectItem value="Viewer">Viewer</SelectItem>
								</SelectContent>
							</Select>

							<Button size="icon" variant="ghost">
								<Trash className="h-4 w-4 text-destructive" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</SectionMain>
	);
}
