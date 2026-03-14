import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { PartyPopper, Users } from "lucide-react";
import { OrganizationsTable } from "./components/organizations-table";
import SectionHeader from "./components/section-header";
import SectionMain from "./components/section-main";

export const Organizations = () => {
	return (
		<SectionMain>
			<div className="flex h-full flex-col gap-6 p-6">
				{/* Page Header */}
				<SectionHeader
					description="Manage users, roles, and account access across the platform."
					icon={Users}
					title="Organizations Management"
				>
					{/* Action */}
					<Button className="flex items-center gap-2" variant="outline">
						<PartyPopper className="h-4 w-4" />
						Onboard New Organization
					</Button>
				</SectionHeader>

				{/* Table */}
				<div className="flex-1 overflow-hidden rounded-xl border bg-card p-4">
					<OrganizationsTable />
				</div>
			</div>
		</SectionMain>
	);
};

export default Organizations;
