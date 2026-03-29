import { ApiKeyTable } from "@zero-heads-lab/auth/components/api-key-table";
import { SessionTable } from "@zero-heads-lab/auth/components/session-table";
import { SectionHeader } from "../_components/section-header";
import SectionMain from "../_components/section-main";

export function SecuritySettings() {
	return (
		<SectionMain>
			<SectionHeader
				description="Manage your account security settings."
				title="Security"
			/>
			<div className="flex flex-col gap-6">
				<ApiKeyTable />
				<SessionTable />
			</div>
		</SectionMain>
	);
}
