import { useOnboarding } from "@onboardjs/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import confetti from "canvas-confetti";
import {
	ArrowRight,
	Check,
	PartyPopper,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { PRICING } from "@/data/pricing";

export function FinalStep({ className }: React.ComponentProps<"div">) {
	const [selectedPlan, setSelectedPlan] = useState<string>("Pro");
	const { next } = useOnboarding();

	useEffect(() => {
		const duration = 3 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
		const randomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		const interval = setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) return clearInterval(interval);
			const particleCount = 50 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);

		return () => clearInterval(interval);
	}, []);

	const filteredPlans = PRICING.filter((plan) => plan.name !== "Enterprise");

	return (
		<div
			className={cn(
				"fade-in zoom-in-95 relative flex h-screen w-full animate-in flex-col items-center justify-center overflow-hidden bg-background px-6 py-4 duration-1000",
				className
			)}
		>
			{/* Background Magic Glow */}
			<div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-primary/10 opacity-40 blur-[100px]" />

			<div className="flex w-full max-w-7xl flex-col items-center gap-y-6 sm:gap-y-8">
				{/* Header - Balanced size */}
				<header className="flex flex-col items-center text-center">
					<div className="mb-4 flex size-14 animate-bounce items-center justify-center rounded-2xl border bg-background shadow-xl duration-3000">
						<PartyPopper className="size-7 text-primary" />
					</div>
					<h1 className="mb-2 font-black text-4xl tracking-tight sm:text-5xl">
						You're officially a pro.
					</h1>
					<p className="max-w-2xl text-base text-muted-foreground leading-relaxed">
						Select your plan to unlock the full potential of{" "}
						<span className="font-semibold text-foreground">Zero Heads</span>.
					</p>
				</header>

				{/* Pricing Grid - Restoration of the Big-Card Design */}
				<div className="grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredPlans.map((plan) => (
						<button
							aria-pressed={selectedPlan === plan.name}
							className={cn(
								"group relative flex w-full flex-col rounded-3xl border bg-card p-6 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary",
								selectedPlan === plan.name
									? "scale-[1.02] border-primary shadow-2xl ring-2 ring-primary/20"
									: "border-border hover:border-primary/40 hover:shadow-lg"
							)}
							key={plan.name}
							onClick={() => setSelectedPlan(plan.name)}
							type="button"
						>
							{plan.popular && (
								<div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-primary px-3 py-1 font-bold text-[10px] text-primary-foreground uppercase tracking-wider">
									Most Popular
								</div>
							)}

							<div className="mb-4 flex items-center justify-between">
								<div className="flex size-10 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-background">
									{plan.icon}
								</div>
								{selectedPlan === plan.name && (
									<div className="zoom-in flex size-6 animate-in items-center justify-center rounded-full bg-primary text-primary-foreground">
										<Check className="size-4" />
									</div>
								)}
							</div>

							<h3 className="font-bold text-xl tracking-tight">{plan.name}</h3>
							<div className="mt-1 flex items-baseline gap-1">
								<span className="font-black text-3xl">{plan.price}</span>
								{plan.price !== "Custom" && (
									<span className="text-muted-foreground text-xs">/mo</span>
								)}
							</div>

							<div className="my-5 h-px w-full bg-border/60" />

							<ul className="mb-6 flex flex-1 flex-col gap-3">
								{plan.features.map((feature) => (
									<li
										className="flex items-center gap-2 text-foreground/80 text-sm"
										key={feature}
									>
										<Check className="size-4 shrink-0 text-primary" />
										<span className="truncate">{feature}</span>
									</li>
								))}
							</ul>

							<div
								className={cn(
									"flex h-11 w-full items-center justify-center rounded-xl border font-bold text-sm transition-all",
									selectedPlan === plan.name
										? "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/20"
										: "border-input bg-background text-foreground group-hover:bg-accent"
								)}
							>
								{plan.cta}
							</div>
						</button>
					))}
				</div>

				{/* Final Actions - High Contrast Bottom Bar */}
				<footer className="mt-4 flex flex-col items-center gap-4">
					<Link
						className="w-full sm:w-auto"
						to={
							selectedPlan !== "Basic" ? "/" : "/" //TODO: Change to payment page
						}
					>
						<Button
							className="group h-14 w-full px-16 font-bold text-lg shadow-2xl shadow-primary/30 sm:w-[400px]"
							onClick={() => {
								next();
							}}
							size="lg"
						>
							{selectedPlan !== "Basic" ? "Checkout" : "Visit Dashboard 🚀"}
							<ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
						</Button>
					</Link>

					<div className="flex items-center gap-4 font-medium text-muted-foreground/80 text-xs">
						<div className="flex items-center gap-1.5">
							<ShieldCheck className="size-4 text-primary" />
							<span>Secure checkout</span>
						</div>
						<div className="h-3 w-px bg-border" />
						<div className="flex items-center gap-1.5">
							<Sparkles className="size-4 text-yellow-500" />
							<span>No hidden fees</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
