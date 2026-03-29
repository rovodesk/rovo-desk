import { useOnboarding } from "@onboardjs/react";
import {
	IconBrandGithub,
	IconBrandNotion,
	IconBrandSlack,
} from "@tabler/icons-react";
import { JiraIcon } from "@zero-heads-lab/design-system/assets/icons/jira-icon";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { ArrowRight, CheckCircle2, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";

const INTEGRATIONS = [
	{
		id: "github",
		name: "GitHub",
		description: "Sync PRs and automate issue workflows.",
		icon: <IconBrandGithub className="size-6" />,
		// Use a data attribute or specific border color for the hover state
		brandColor: "hover:border-slate-900",
	},
	{
		id: "notion",
		name: "Notion",
		description: "Sync documentation and internal wikis.",
		icon: <IconBrandNotion className="size-6" />,
		brandColor: "hover:border-zinc-900",
	},
	{
		id: "jira",
		name: "Jira",
		description: "Connect enterprise backlogs and sprints.",
		icon: <JiraIcon className="size-6" />,
		brandColor: "hover:border-blue-600",
	},
	{
		id: "slack",
		name: "Slack",
		description: "Get real-time AI alerts in your channels.",
		icon: <IconBrandSlack className="size-6" />,
		brandColor: "hover:border-[#4A154B]",
	},
];

export function IntegrationStep({ className }: React.ComponentProps<"div">) {
	const { next, skip } = useOnboarding();
	const [connected, setConnected] = useState<string[]>([]);

	const toggleIntegration = (id: string) => {
		setConnected((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	return (
		<div
			className={cn(
				"fade-in slide-in-from-bottom-4 mx-auto w-full max-w-4xl animate-in px-4 py-10 duration-500",
				className
			)}
		>
			<div className="mb-12 flex flex-col items-center text-center">
				<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs">
					<Plus className="size-3" />
					<span>Integrations</span>
				</div>
				<h1 className="mb-4 font-bold text-3xl text-foreground tracking-tight md:text-4xl">
					Connect your stack
				</h1>
				<p className="max-w-xl text-lg text-muted-foreground">
					Zero Heads works where you do. Select the tools you'd like to sync
					with your new AI workspace.
				</p>
			</div>

			<div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
				{INTEGRATIONS.map((app) => {
					const isConnected = connected.includes(app.id);
					return (
						<button
							className={cn(
								"group relative flex items-start gap-4 rounded-xl border-2 p-6 text-left transition-all duration-300 ease-out",
								"hover:-translate-y-1 hover:shadow-md active:translate-y-0",
								isConnected
									? "border-primary bg-primary/3 ring-1 ring-primary"
									: cn("border-border bg-card", app.brandColor)
							)}
							key={app.id}
							onClick={() => toggleIntegration(app.id)}
						>
							{/* Icon Container with subtle scale on hover */}
							<div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[#72e3ad]/10">
								{app.icon}
							</div>

							<div className="flex-1 pr-6">
								<h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
									{app.name}
								</h3>
								<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
									{app.description}
								</p>
							</div>

							{/* Status Indicator */}
							<div className="absolute top-6 right-6">
								<div
									className={cn(
										"flex size-6 items-center justify-center rounded-full border transition-all duration-300",
										isConnected
											? "scale-110 border-primary bg-primary"
											: "border-border bg-transparent group-hover:border-primary/50"
									)}
								>
									{isConnected ? (
										<CheckCircle2 className="zoom-in size-4 animate-in text-white duration-300" />
									) : (
										<Plus className="size-3 text-muted-foreground/50 transition-colors group-hover:text-primary" />
									)}
								</div>
							</div>
						</button>
					);
				})}
			</div>

			<div className="flex flex-col items-center gap-6">
				<Button
					className="group h-12 w-full max-w-sm font-medium text-base shadow-primary/10 shadow-xl"
					onClick={() => next()}
					size="lg"
				>
					{connected.length > 0 ? "Finish Setup" : "Continue"}
					<ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
				</Button>

				<button
					className="font-medium text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline"
					onClick={() => skip()}
				>
					I'll configure these later
				</button>
			</div>

			<p className="mt-12 text-center font-semibold text-[11px] text-muted-foreground/60 uppercase tracking-widest">
				Secure OAuth 2.0 Encryption
			</p>
		</div>
	);
}
