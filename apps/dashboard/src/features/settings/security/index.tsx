import { ContentSection } from "../_components/content-section";
import { SessionTable } from "./session-table";

export function SettingsSecurity() {
	return (
		<ContentSection desc="Configure your security settings." title="Security">
			<div className="flex flex-col gap-6">
				{/* <TwoFactorAuthenticationCard /> */}
				<SessionTable />
			</div>
		</ContentSection>
	);
}
