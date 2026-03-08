import React from "react";
import { type FREQUENCY, FrequencyToggle } from "./frequency-toggle";
import { plans } from "./plan";
import { PriceCard } from "./price-card";

export function PricingSection() {
	const [frequency, setFrequency] = React.useState<FREQUENCY>("monthly");

	return (
		<section className="bg-background py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<p className="mt-2 font-bold text-4xl text-foreground tracking-tight sm:text-5xl">
						Plans that scale with you
					</p>
					<p className="mt-6 text-lg text-muted-foreground leading-8">
						Whether you're just starting out or growing fast, our flexible
						pricing has you covered—with no hidden costs.
					</p>
				</div>

				<div className="mt-12 flex justify-center">
					<FrequencyToggle frequency={frequency} setFrequency={setFrequency} />
				</div>

				<div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
					{plans.map((plan) => (
						<PriceCard frequency={frequency} key={plan.name} plan={plan} />
					))}
				</div>
			</div>
		</section>
	);
}
