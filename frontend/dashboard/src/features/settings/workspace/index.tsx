import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import {
	InputGroup,
	InputGroupButton,
	InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { Copy, Import, Trash, Users } from "lucide-react";
import { useState } from "react";
import { useOrganization } from "@/hooks/use-organization";
import { SectionHeader } from "../_components/section-header";
import SectionMain from "../_components/section-main";
import { SettingRow } from "../_components/setting-row";

export function WorkspaceSettings() {
	const { data: organization } = useOrganization();

	const [workspaceIdCopied, setWorkspaceIdCopied] = useState(false);

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

	const currentOrganization = organization?.currentOrganization;
	const copyWorkspaceId = async () => {
		if (!currentOrganization) return;

		await navigator.clipboard.writeText(currentOrganization);
		setWorkspaceIdCopied(true);

		toast.success("Workspace ID copied");

		setTimeout(() => setWorkspaceIdCopied(false), 2000);
	};

	return (
		<SectionMain className="space-y-8">
			{/* Workspace Info */}
			<div className="rounded-xl border bg-background p-6 shadow-sm">
				<SectionHeader
					description="Manage general workspace settings."
					title="Workspace"
				/>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Workspace ID</Label>

						<div className="flex items-center gap-2">
							<InputGroup>
								<InputGroupInput
									className="border-dashed font-mono text-xs"
									disabled
									readOnly
									value={organization?.currentOrganization ?? ""}
								/>

								<InputGroupButton
									onClick={copyWorkspaceId}
									size="icon-sm"
									variant="ghost"
								>
									<Copy
										className={cn(
											"h-4 w-4",
											workspaceIdCopied && "text-primary"
										)}
									/>
								</InputGroupButton>
							</InputGroup>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Workspace Name</Label>
						<Input defaultValue={organization?.currentOrganization ?? ""} />
					</div>

					<div className="space-y-2">
						<Label>Timezone</Label>
						<Input defaultValue="Europe/Vienna (UTC+1)" />
					</div>

					<div className="space-y-2">
						<Label>Language</Label>
						<Input defaultValue="English" />
					</div>
				</div>

				<div className="mt-6 flex justify-end">
					<Button>Save Changes</Button>
				</div>
			</div>

			{/* Interface Settings */}
			<div className="rounded-xl border bg-background p-6 shadow-sm">
				<SectionHeader
					description="Customize the appearance of your workspace."
					title="Interface"
				/>

				<div className="mt-6 divide-y">
					<SettingRow
						description="Use smaller spacing and font sizes."
						label="Compact mode"
					>
						<Switch />
					</SettingRow>

					<SettingRow
						description="Display user avatars in conversation lists."
						label="Show avatars"
					>
						<Switch defaultChecked />
					</SettingRow>

					<SettingRow
						description="Show message previews in the list."
						label="Conversation previews"
					>
						<Switch defaultChecked />
					</SettingRow>
				</div>
			</div>

			{/* Members */}
			<div className="rounded-xl border bg-background shadow-sm">
				<div className="flex items-center justify-between border-b px-6 py-4">
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<h3 className="font-semibold text-sm">Workspace Members</h3>
					</div>

					<div className="flex items-center gap-2">
						<Button size="sm">Invite Member</Button>

						<Button size="sm" variant="outline">
							<Import className="mr-2 h-4 w-4" />
							Import
						</Button>
					</div>
				</div>

				<div className="divide-y">
					{members.map((m) => (
						<div
							className="flex items-center justify-between px-6 py-4 hover:bg-muted/40"
							key={m.email}
						>
							<div className="flex flex-col">
								<span className="font-medium text-sm">{m.name}</span>
								<span className="text-muted-foreground text-xs">{m.email}</span>
							</div>

							<div className="flex items-center gap-3">
								<Select
									onValueChange={(v) => updateRole(m.email, v)}
									value={m.role}
								>
									<SelectTrigger className="h-8 w-[130px] text-xs">
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
			</div>
		</SectionMain>
	);
}
