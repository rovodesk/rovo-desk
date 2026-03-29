import { BillingHistoryTable } from "@zero-heads-lab/billing/components/billing-history-table";
import { PaymentMethod } from "@zero-heads-lab/billing/components/payment-method";
import { SubscriptionOverview } from "@zero-heads-lab/billing/components/subscription-overview";
import { SectionHeader } from "./_components/section-header";
import SectionMain from "./_components/section-main";

export function BillingSettings() {
	return (
		<SectionMain>
			<SectionHeader
				description="Manage your subscription and payment methods."
				title="Billing"
			/>
			<div className="space-y-8">
				<SubscriptionOverview />
				<PaymentMethod />
				<BillingHistoryTable />
			</div>
		</SectionMain>
	);
}
