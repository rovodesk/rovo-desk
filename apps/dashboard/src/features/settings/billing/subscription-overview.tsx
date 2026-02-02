import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@zero-heads-lab/design-system/components/ui/card";

export const SubscriptionOverview = () => {
	return (
		<Card className="border-primary/20 bg-primary/5">
			<CardHeader>
				<CardTitle>Current Plan</CardTitle>
				<CardDescription>
					You are currently on the <strong>Pro Plan</strong>.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground text-sm">
					Your next billing date is{" "}
					<span className="font-medium text-foreground">March 1, 2026</span> for{" "}
					<span className="font-medium text-foreground">$29.00</span>.
				</p>
			</CardContent>
			<CardFooter className="flex justify-end gap-3">
				<Button variant="default">Upgrade Plan</Button>
				<Button variant="destructive">Cancel Subscription</Button>
			</CardFooter>
		</Card>
	);
};

export default SubscriptionOverview;
