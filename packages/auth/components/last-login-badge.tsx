import {
	GithubIcon,
	GoogleIcon,
} from "@zero-heads-lab/design-system/assets/icons";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { CircleQuestionMark, KeyRound, Mail } from "lucide-react";
import { useLastLoginMethod } from "../hooks";

const METHOD_CONFIG: Record<
	string,
	{
		label: string;
		icon: React.ComponentType<React.ComponentProps<"svg">>;
		className: string;
	}
> = {
	google: {
		label: "Google",
		icon: GoogleIcon,
		className: "bg-red-500/10 text-red-500 border-red-500/10",
	},
	github: {
		label: "GitHub",
		icon: GithubIcon,
		className: "bg-zinc-500/10 text-zinc-200 border-zinc-500/20",
	},
	passkey: {
		label: "Passkey",
		icon: KeyRound,
		className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
	},
	magiclink: {
		label: "Magic Link",
		icon: Mail,
		className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
	},
	unknown: {
		label: "Unknown",
		icon: CircleQuestionMark,
		className: "bg-muted/10 text-muted-foreground border-muted",
	},
};

type LastLoginBadgeProps = {
	compact?: boolean;
	className?: string;
};

export function LastLoginBadge({
	compact = false,
	className,
}: LastLoginBadgeProps) {
	const { lastLoginMethod, isLoading } = useLastLoginMethod();

	if (isLoading) {
		return (
			<div
				className={cn(
					"h-6 w-24 animate-pulse rounded-full bg-muted/20",
					className
				)}
			/>
		);
	}

	const config =
		METHOD_CONFIG[lastLoginMethod?.toLowerCase() || "unknown"] ||
		METHOD_CONFIG.unknown;

	const Icon = config?.icon;

	return (
		<Badge
			className={cn(
				"relative flex items-center transition-all duration-300",
				"border-none shadow-sm",
				compact ? "h-6 gap-1.5 px-2" : "h-8 gap-2 px-3",
				config?.className,
				className
			)}
			variant="outline"
		>
			{/* Soft Glow Background Overlay */}
			<div className="pointer-events-none absolute inset-0 rounded-full opacity-[0.03]" />

			{/* Icon - Scaled to fit modern proportions */}
			{!compact && Icon && (
				<Icon className={cn("shrink-0", compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
			)}

			<div className="flex items-baseline gap-1.5">
				<span
					className={cn(
						"font-semibold tracking-tight",
						compact ? "text-[10px]" : "text-xs"
					)}
				>
					{compact ? "Last Login" : config?.label}
				</span>
			</div>
		</Badge>
	);
}
