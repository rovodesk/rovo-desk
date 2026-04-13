import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@zero-heads-lab/design-system/components/ui/toggle-group";
import type { WidgetLauncher } from "@zero-heads-lab/shared/lib/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

export function LauncherTab({
	launcher,
	onChange,
}: {
	launcher: WidgetLauncher;
	onChange: (launcher: Partial<WidgetLauncher>) => void;
}) {
	return (
		<div className="flex h-full flex-col">
			<ScrollArea axis="vertical" className="flex-1">
				<div className="space-y-1">
					{/* Launcher Position */}
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

					{/* Launcher */}
					<SectionGroup title="Style">
						{/* Logo [Premium] */}
						<div className="space-y-2">
							<Label className="text-muted-foreground text-sm">Logo</Label>
							<Input disabled placeholder="Choose Launcher Logo" type="file" />
						</div>
						{/* Label */}
						<div className="space-y-2">
							<Label className="text-muted-foreground text-sm">
								Label Text
							</Label>
							<Input
								className="h-9"
								onChange={(e) => onChange({ labelText: e.target.value })}
								value={launcher.labelText}
							/>
						</div>
					</SectionGroup>

					<div className="border-border border-t" />

					{/* Compact Mode */}
					<div className="mt-4 flex items-center justify-between">
						<Label className="text-muted-foreground text-sm">Compact</Label>
						<Switch
							checked={launcher.compact}
							onCheckedChange={(v) => onChange({ compact: v })}
						/>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
