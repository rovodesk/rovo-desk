import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { UserIcon, UserPlus } from "lucide-react";
import SectionHeader from "./components/section-header";
import SectionMain from "./components/section-main";
import { UsersTable } from "./components/users-table";

export const Users = () => {
	return (
		<SectionMain>
			<div className="flex h-full flex-col gap-6 p-6">
				{/* Page Header */}
				<SectionHeader
					description="Manage users, roles, and account access across the platform."
					icon={UserIcon}
					title="User Management"
				>
					{/* Action */}
					<Button className="flex items-center gap-2">
						<UserPlus className="h-4 w-4" />
						Add User
					</Button>
				</SectionHeader>

				{/* Table */}
				<div className="flex-1 overflow-hidden rounded-xl border bg-card p-4">
					<UsersTable />
				</div>
			</div>
		</SectionMain>
	);
};

export default Users;
