import { BillingHistoryTable } from "@zero-heads-lab/billing/components/billing-history-table";
import { PaymentMethod } from "@zero-heads-lab/billing/components/payment-method";
import { SubscriptionOverview } from "@zero-heads-lab/billing/components/subscription-overview";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
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
				<div className="mb-4 rounded-lg border border-border p-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-semibold text-sm">Pro Plan</div>
							<div className="text-muted-foreground text-xs">
								$49/month · Billed monthly
							</div>
						</div>
						<Badge className="bg-success text-success-foreground">Active</Badge>
					</div>
				</div>
				<div className="space-y-3 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Next billing date</span>
						<span className="font-medium">March 28, 2026</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Payment method</span>
						<span className="font-medium">Visa •••• 4242</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Seats used</span>
						<span className="font-medium">4 / 10</span>
					</div>
				</div>
				<div className="mt-4 flex gap-2">
					<Button size="sm" variant="outline">
						Change Plan
					</Button>
					<Button size="sm" variant="outline">
						Update Payment
					</Button>
				</div>
			</div>
		</SectionMain>
	);
}
