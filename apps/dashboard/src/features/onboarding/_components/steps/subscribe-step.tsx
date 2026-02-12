import { useOnboarding } from "@onboardjs/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	ArrowRight,
	BellRing,
	Mail,
	Megaphone,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { Socials } from "@/data/socials";

export function SubscribeStep({ className }: React.ComponentProps<"div">) {
	const { next, skip } = useOnboarding();

	const [preferences, setPreferences] = useState({
		updates: true,
		changelog: true,
		marketing: false,
		newsletter: false,
	});

	const hasAnySelected = Object.values(preferences).some(Boolean);

	const togglePreference = (key: keyof typeof preferences) => {
		setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div
			className={cn(
				"fade-in slide-in-from-bottom-4 mx-auto w-full max-w-3xl animate-in px-4 py-6 duration-500",
				className
			)}
		>
			{/* Header - Slimmed down */}
			<div className="mb-8 flex flex-col items-center text-center">
				<div className="relative mb-4">
					<div className="absolute -inset-2 rounded-full bg-primary/20 opacity-50 blur-lg" />
					<BellRing className="relative size-10 text-primary" />
				</div>
				<h1 className="font-bold text-2xl tracking-tight">Stay in the loop</h1>
				<p className="max-w-md text-muted-foreground text-sm">
					Customize your notifications. You can change these preferences at any
					time.
				</p>
			</div>

			{/* Main Grid Content */}
			<div className="grid gap-4">
				{/* 2-Column Subscription Grid */}
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					{[
						{
							id: "updates",
							label: "Updates",
							desc: "Latest major updates.",
							icon: <Megaphone />,
							color: "text-rose-500",
						},
						{
							id: "changelog",
							label: "Changelog",
							desc: "Bi-weekly features & fixes.",
							icon: <Sparkles />,
							color: "text-blue-500",
						},
						{
							id: "marketing",
							label: "Tips & Tricks",
							desc: "Master Zero Heads tools.",
							icon: <Mail />,
							color: "text-orange-500",
						},
						{
							id: "newsletter",
							label: "Newsletter",
							desc: "Weekly insights and updates.",
							icon: <Mail />,
							color: "text-green-500",
						},
					].map((item) => (
						<div
							className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-all hover:bg-muted/30"
							key={item.id}
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50",
										item.color
									)}
								>
									{/* Icon scaled down */}
									{React.cloneElement(
										item.icon as React.ReactElement<{ className?: string }>,
										{
											className: "size-4",
										}
									)}
								</div>
								<div className="space-y-0.5">
									<Label
										className="cursor-pointer font-semibold text-sm"
										htmlFor={item.id}
									>
										{item.label}
									</Label>
									<p className="text-[12px] text-muted-foreground leading-none">
										{item.desc}
									</p>
								</div>
							</div>
							<Switch
								checked={preferences[item.id as keyof typeof preferences]}
								id={item.id}
								onCheckedChange={() =>
									togglePreference(item.id as keyof typeof preferences)
								}
							/>
						</div>
					))}
				</div>

				{/* Compact Socials Footer (Optional - or keep the Grid item above) */}
				<div className="rounded-xl border bg-card p-4">
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						{Socials.map((social) => (
							<Link
								className="w-full"
								key={social.name}
								target="_blank"
								to={social.href}
							>
								<Button
									className={cn(
										"h-8 w-full gap-1.5 px-2 text-[10px]",
										social.hoverClass
									)}
									size="xs"
									variant="outline"
								>
									<span className="size-3">
										{React.cloneElement(
											social.icon as unknown as React.ReactElement<{
												className?: string;
											}>,
											{
												className: "size-4",
											}
										)}
									</span>
									{social.name}
								</Button>
							</Link>
						))}
					</div>
				</div>
			</div>

			{/* Actions - Tighter spacing */}
			<div className="mt-8 flex flex-col items-center gap-3">
				<Button
					className={cn(
						"h-11 w-full max-w-xs font-medium transition-all duration-300",
						hasAnySelected
							? "shadow-md shadow-primary/20"
							: "bg-muted text-muted-foreground"
					)}
					onClick={() => (hasAnySelected ? next() : skip())}
					variant={hasAnySelected ? "default" : "secondary"}
				>
					{hasAnySelected ? "Save Preferences" : "Skip Updates"}
					{hasAnySelected && <ArrowRight className="ml-2 size-4" />}
				</Button>

				<div className="flex items-center gap-1.5 text-[10px] text-muted-foreground opacity-60">
					<ShieldCheck className="size-3" />
					<span>No spam. One-click unsubscribe.</span>
				</div>
			</div>
		</div>
	);
}
