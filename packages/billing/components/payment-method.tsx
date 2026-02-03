import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@zero-heads-lab/design-system/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { CreditCard, Plus } from "lucide-react";

export const PaymentMethod = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment Method</CardTitle>
				<CardDescription>Update your default payment details.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between rounded-lg border p-4">
					<div className="flex items-center gap-4">
						<div className="rounded-md bg-secondary p-2">
							<CreditCard className="h-6 w-6" />
						</div>
						<div>
							<p className="font-medium text-sm">Visa ending in 4242</p>
							<p className="text-muted-foreground text-xs">Expires 12/28</p>
						</div>
					</div>
					<Button size="sm" variant="ghost">
						Edit
					</Button>
				</div>
			</CardContent>
			<CardFooter>
				<AddPaymentMethodDialog />
			</CardFooter>
		</Card>
	);
};

function AddPaymentMethodDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-full sm:w-auto" variant="outline">
					<Plus className="mr-2 h-4 w-4" /> Add New Method
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Payment Method</DialogTitle>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
