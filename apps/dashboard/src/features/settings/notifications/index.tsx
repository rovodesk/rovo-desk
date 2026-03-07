import { SectionHeader } from "../_components/section-header";
import SectionMain from "../_components/section-main";
import { NotificationsForm } from "./notifications-form";

export function NotificationSettings() {
	return (
		<SectionMain>
			<SectionHeader
				description="Choose what notifications you receive."
				title="Notifications"
			/>
			<NotificationsForm />
		</SectionMain>
	);
}
