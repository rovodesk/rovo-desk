import { useOnboarding } from "@onboardjs/react";
import Logo from "@zero-heads-lab/design-system/components/logo";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export function WelcomeStep({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { next, updateContext } = useOnboarding();
	const { data: user } = useUser();

	const handleGetStarted = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		updateContext({
			currentUser: user,
		});
		next();
	};

	return (
		<div
			className={cn(
				"flex min-h-[60vh] flex-col items-center justify-center px-4",
				className
			)}
			{...props}
		>
			{/* Background Decorative Element */}
			<div className="absolute inset-0 -z-10 h-full w-full bg-white opacity-20 [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]" />

			<div className="flex w-full max-w-2xl flex-col items-center space-y-8 text-center">
				{/* Logo Section with Glow */}
				<div className="group relative">
					<div className="absolute -inset-1 rounded-full bg-linear-to-r from-primary to-blue-600 opacity-25 blur transition duration-1000 group-hover:opacity-50" />
					<div className="relative flex size-24 items-center justify-center rounded-2xl border bg-background shadow-sm">
						<Logo className="zoom-in size-12 animate-in duration-500" />
					</div>
				</div>

				{/* Typography with SaaS Hierarchy */}
				<div className="space-y-4">
					<div className="mb-2 inline-flex items-center rounded-full border border-transparent bg-primary/10 px-2.5 py-0.5 font-semibold text-primary text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
						<Sparkles className="mr-1 size-3" />
						<span>v2.0 is now live</span>
					</div>

					<h1 className="bg-linear-to-b from-foreground to-foreground/70 bg-clip-text font-extrabold text-4xl text-transparent tracking-tight md:text-6xl lg:text-7xl">
						Welcome to Zero Heads
					</h1>

					<p className="mx-auto max-w-prose text-lg text-muted-foreground leading-relaxed md:text-xl">
						A purpose-built AI support system designed to automate your
						operations and scale your business effortlessly.
					</p>
				</div>

				{/* CTA Section */}
				<div className="flex w-full flex-col items-center gap-4 sm:w-auto">
					<Button
						className="group h-12 w-full px-8 font-medium text-base transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] sm:w-[280px]"
						onClick={handleGetStarted}
						size="lg"
					>
						Get started
						<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
					</Button>

					<p className="text-muted-foreground text-xs">
						No credit card required • Set up in 2 minutes
					</p>
				</div>
			</div>
		</div>
	);
}
