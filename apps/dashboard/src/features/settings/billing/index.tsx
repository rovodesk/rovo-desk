import { ContentSection } from "../_components/content-section";
import { BillingHistoryTable } from "./billing-history-table";
import { PaymentMethod } from "./payment-method";
import { SubscriptionOverview } from "./subscription-overview";

export function SettingsBilling() {
	return (
		<ContentSection
			desc="Manage your subscription, payment methods, and download invoices."
			title="Billing"
		>
			<div className="space-y-8">
				<SubscriptionOverview />
				<PaymentMethod />
				<BillingHistoryTable />
			</div>
		</ContentSection>
	);
}
