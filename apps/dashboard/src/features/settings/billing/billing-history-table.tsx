import { useCustomerSubscription } from "@zero-heads-lab/auth/hooks/use-customer-subscription";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@zero-heads-lab/design-system/components/ui/table";
import { Download } from "lucide-react";

export const BillingHistoryTable = () => {
	const { subscriptions, isLoading } = useCustomerSubscription();

	if (isLoading) return <BillingHistoryTableSkeleton />;

	console.log(subscriptions);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-lg">Billing History</h3>
				<Button animated={false} variant="outline">
					<Download className="mr-2 h-4 w-4" />
					Download Invoice History
				</Button>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Invoice</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[
							{ date: "Feb 1, 2026", amount: "$29.00", status: "Paid" },
							{ date: "Jan 1, 2026", amount: "$29.00", status: "Paid" },
						].map((invoice, i) => (
							<TableRow key={i}>
								<TableCell className="font-medium">{invoice.date}</TableCell>
								<TableCell>{invoice.amount}</TableCell>
								<TableCell>
									<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-700 text-xs">
										{invoice.status}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<Button size="icon" variant="ghost">
										<Download className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export const BillingHistoryTableSkeleton = () => {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-lg">Billing History</h3>
				<Skeleton className="h-10 w-40" />
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Invoice</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[1, 2, 3, 4, 5].map((i) => (
							<TableRow key={i}>
								<TableCell className="font-medium">
									<Skeleton className="h-4 w-20" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-20" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-20" />
								</TableCell>
								<TableCell className="text-right">
									<Button size="icon" variant="ghost">
										<Download className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
