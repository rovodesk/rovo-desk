import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@zero-heads-lab/design-system/components/ui/toggle-group";
import type { WidgetLauncher } from "@zero-heads-lab/shared/types";
import {
	ChevronDown,
	Headphones,
	HelpCircle,
	MessageCircle,
	MessageSquare,
} from "lucide-react";
import { useState } from "react";

interface Props {
	launcher: WidgetLauncher;
	onChange: (launcher: Partial<WidgetLauncher>) => void;
}

function SectionGroup({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(true);
	return (
		<Collapsible onOpenChange={setOpen} open={open}>
			<CollapsibleTrigger className="flex w-full items-center justify-between py-2.5 font-semibold text-foreground text-sm transition-colors hover:text-primary">
				{title}
				<ChevronDown
					className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</CollapsibleTrigger>
			<CollapsibleContent className="space-y-4 pb-4">
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
}

const iconOptions = [
	{ value: "message-circle", icon: MessageCircle, label: "Chat" },
	{ value: "message-square", icon: MessageSquare, label: "Square" },
	{ value: "headphones", icon: Headphones, label: "Support" },
	{ value: "help-circle", icon: HelpCircle, label: "Help" },
];

export function LauncherTab({ launcher, onChange }: Props) {
	return (
		<div className="space-y-1">
			<SectionGroup title="Position">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Launcher Position
					</Label>
					<ToggleGroup
						className="justify-start"
						onValueChange={(v) =>
							v && onChange({ position: v as "left" | "right" })
						}
						type="single"
						value={launcher.position}
					>
						<ToggleGroupItem className="px-6 text-xs" value="left">
							Left
						</ToggleGroupItem>
						<ToggleGroupItem className="px-6 text-xs" value="right">
							Right
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Style">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Icon</Label>
					<ToggleGroup
						className="justify-start"
						onValueChange={(v) => v && onChange({ icon: v })}
						type="single"
						value={launcher.icon}
					>
						{iconOptions.map((opt) => (
							<ToggleGroupItem
								className="px-3"
								key={opt.value}
								value={opt.value}
							>
								<opt.icon className="h-4 w-4" />
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Label Text</Label>
					<Input
						className="h-9"
						onChange={(e) => onChange({ labelText: e.target.value })}
						value={launcher.labelText}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">Show Label</Label>
					<Switch
						checked={launcher.showLabel}
						onCheckedChange={(v) => onChange({ showLabel: v })}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Visibility">
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Show on Mobile
					</Label>
					<Switch
						checked={launcher.showOnMobile}
						onCheckedChange={(v) => onChange({ showOnMobile: v })}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Show on Desktop
					</Label>
					<Switch
						checked={launcher.showOnDesktop}
						onCheckedChange={(v) => onChange({ showOnDesktop: v })}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Hide Default Launcher
					</Label>
					<Switch
						checked={launcher.hideDefault}
						onCheckedChange={(v) => onChange({ hideDefault: v })}
					/>
				</div>
			</SectionGroup>
		</div>
	);
}
