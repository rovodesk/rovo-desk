import { BillingHistoryTable } from "@zero-heads-lab/billing/components/billing-history-table";
import { PaymentMethod } from "@zero-heads-lab/billing/components/payment-method";
import { SubscriptionOverview } from "@zero-heads-lab/billing/components/subscription-overview";
import { ContentSection } from "./_components/content-section";

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
