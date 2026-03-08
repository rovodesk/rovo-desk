import NumberFlow from "@number-flow/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { CheckIcon, StarIcon } from "lucide-react";
import type { FREQUENCY } from "./frequency-toggle";
import type { Plan } from "./plan";

export type PriceCardProps = React.ComponentProps<"div"> & {
	plan: Plan;
	frequency?: FREQUENCY;
};

export function PriceCard({
	plan,
	className,
	frequency = "monthly",
}: PriceCardProps) {
	return (
		<div
			className={cn(
				"relative flex flex-col justify-between rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md",
				plan.highlighted && "ring-2 ring-primary",
				className
			)}
		>
			{plan.highlighted && (
				<div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground text-xs">
					<StarIcon className="size-3 fill-current" />
					Most Popular
				</div>
			)}

			<div>
				<div className="flex items-center justify-between gap-x-4">
					<h3 className="font-semibold text-foreground text-lg leading-8">
						{plan.name}
					</h3>
					{frequency === "yearly" && plan.price.monthly > plan.price.yearly && (
						<span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary text-xs leading-5">
							Save{" "}
							{Math.round(
								((plan.price.monthly - plan.price.yearly) /
									plan.price.monthly) *
									100
							)}
							%
						</span>
					)}
				</div>
				<p className="mt-4 text-muted-foreground text-sm leading-6">
					{plan.info}
				</p>
				<div className="mt-6 flex items-baseline gap-x-1">
					<NumberFlow
						className="font-bold text-4xl text-foreground tracking-tight"
						format={{ style: "currency", currency: "USD" }}
						value={plan.price[frequency]}
					/>
					<span className="font-semibold text-muted-foreground text-sm leading-6">
						/month
					</span>
				</div>
				<p className="mt-1 text-muted-foreground/70 text-xs italic">
					Billed {frequency}
				</p>

				<ul className="mt-8 space-y-3 text-muted-foreground text-sm leading-6">
					{plan.features.map((feature) => (
						<li className="flex gap-x-3" key={feature}>
							<CheckIcon
								aria-hidden="true"
								className="h-6 w-5 flex-none text-primary"
							/>
							{feature}
						</li>
					))}
				</ul>
			</div>

			<Button
				asChild
				className="mt-8 w-full rounded-xl py-6 font-semibold text-md"
				variant={plan.highlighted ? "default" : "outline"}
			>
				<Link to={plan.btn.href}>{plan.btn.text}</Link>
			</Button>
		</div>
	);
}
