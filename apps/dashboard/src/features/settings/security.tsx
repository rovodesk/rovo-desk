import { SessionTable } from "@zero-heads-lab/auth/components/session-table";
import { ContentSection } from "./_components/content-section";

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
