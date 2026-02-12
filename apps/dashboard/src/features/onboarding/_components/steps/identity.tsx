import { useOnboarding } from "@onboardjs/react";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	ChevronRight,
	Globe,
	MessageSquare,
	Search,
	Share2,
	Target,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import { useState } from "react";

const CHANNELS = [
	{ id: "google", label: "Search Engine", icon: <Search className="size-4" /> },
	{ id: "social", label: "Social Media", icon: <Share2 className="size-4" /> },
	{ id: "word", label: "Word of Mouth", icon: <Users className="size-4" /> },
	{ id: "ads", label: "Online Ads", icon: <Globe className="size-4" /> },
];

const GOALS = [
	{
		id: "speed",
		label: "Faster Support",
		desc: "Slash response times.",
		icon: <Zap className="size-5 text-yellow-500" />,
	},
	{
		id: "growth",
		label: "Scale Team",
		desc: "Manage more users.",
		icon: <TrendingUp className="size-5 text-green-500" />,
	},
	{
		id: "satisfaction",
		label: "Customer Bliss",
		desc: "Improve CSAT scores.",
		icon: <MessageSquare className="size-5 text-blue-500" />,
	},
];

export function IdentityStep({ className }: React.ComponentProps<"div">) {
	const { next, skip } = useOnboarding();
	const [channel, setChannel] = useState<string | null>(null);
	const [goal, setGoal] = useState<string | null>(null);

	return (
		<div
			className={cn(
				"fade-in slide-in-from-bottom-4 relative mx-auto flex w-full max-w-4xl animate-in flex-col items-center justify-center duration-700",
				className
			)}
		>
			{/* Header */}
			<header className="mb-8 text-center">
				<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
					<Target className="size-6" />
				</div>
				<h1 className="mb-2 font-black text-3xl tracking-tight">
					Help us tailor your experience
				</h1>
				<p className="text-muted-foreground text-sm">
					We'll customize your workspace based on your objectives.
				</p>
			</header>

			<div className="grid w-full gap-8">
				{/* Section 1: Attribution */}
				<section className="space-y-4">
					<Label className="px-1 font-bold text-base">
						How did you hear about us?
					</Label>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{CHANNELS.map((item) => (
							<button
								className={cn(
									"flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
									channel === item.id
										? "border-primary bg-primary/5 ring-1 ring-primary"
										: "border-border bg-card hover:border-primary/40"
								)}
								key={item.id}
								onClick={() => setChannel(item.id)}
								type="button"
							>
								<div
									className={cn(
										"flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted",
										channel === item.id && "bg-primary/20 text-primary"
									)}
								>
									{item.icon}
								</div>
								<span className="font-semibold text-xs">{item.label}</span>
							</button>
						))}
					</div>
				</section>

				{/* Section 2: Goals */}
				<section className="space-y-4">
					<Label className="px-1 font-bold text-base">
						What's your primary goal?
					</Label>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{GOALS.map((item) => (
							<button
								className={cn(
									"group relative flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all",
									goal === item.id
										? "scale-[1.02] border-primary bg-primary/5 ring-1 ring-primary"
										: "border-border bg-card hover:border-primary/30"
								)}
								key={item.id}
								onClick={() => setGoal(item.id)}
								type="button"
							>
								<div className="flex size-10 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-background">
									{item.icon}
								</div>
								<div>
									<h4 className="font-bold text-sm">{item.label}</h4>
									<p className="mt-0.5 text-[11px] text-muted-foreground">
										{item.desc}
									</p>
								</div>
							</button>
						))}
					</div>
				</section>
			</div>

			{/* Footer Action */}
			<footer className="mt-10 flex w-full flex-col items-center">
				<Button
					className="group h-12 w-full max-w-sm font-bold shadow-primary/20 shadow-xl transition-all hover:scale-[1.02]"
					disabled={!(channel && goal)}
					onClick={() => next()}
					size="lg"
				>
					Continue
					<ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
				</Button>
				<button
					className="text-muted-foreground text-xs transition-colors hover:text-foreground"
					onClick={() => {
						skip();
					}}
					type="button"
				>
					Skip
				</button>
			</footer>
		</div>
	);
}
