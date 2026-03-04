import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { SectionHeader } from "./_components/section-header";
import SectionMain from "./_components/section-main";
import { SettingRow } from "./_components/setting-row";

export function GeneralSettings() {
	return (
		<SectionMain>
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
		</SectionMain>
	);
}
