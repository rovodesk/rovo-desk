import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { SectionHeader } from "../_components/section-header";
import SectionMain from "../_components/section-main";
import { SettingRow } from "../_components/setting-row";
import { AppearanceForm } from "./appearance-form";

export function AppearenceSettings() {
	return (
		<SectionMain>
			<SectionHeader
				description="Customize the look and feel."
				title="Appearance"
			/>
			<AppearanceForm />
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
