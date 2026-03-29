import { SectionHeader } from "../_components/section-header";
import SectionMain from "../_components/section-main";
import { AppearanceForm } from "./appearance-form";

export function AppearenceSettings() {
	return (
		<SectionMain>
			<SectionHeader
				description="Customize the look and feel."
				title="Appearance"
			/>
			<AppearanceForm />
		</SectionMain>
	);
}
