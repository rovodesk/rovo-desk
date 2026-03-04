import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { Textarea } from "@zero-heads-lab/design-system/components/ui/textarea";
import type { WidgetAdvanced } from "@zero-heads-lab/shared/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
	advanced: WidgetAdvanced;
	onChange: (advanced: Partial<WidgetAdvanced>) => void;
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

export function AdvancedTab({ advanced, onChange }: Props) {
	return (
		<div className="space-y-1">
			<SectionGroup title="Visibility Rules">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Show on Specific Pages
					</Label>
					<Textarea
						className="min-h-[60px] font-mono text-sm"
						onChange={(e) => onChange({ showOnPages: e.target.value })}
						placeholder="/pricing, /contact"
						value={advanced.showOnPages}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Hide on Specific Pages
					</Label>
					<Textarea
						className="min-h-[60px] font-mono text-sm"
						onChange={(e) => onChange({ hideOnPages: e.target.value })}
						placeholder="/admin, /checkout"
						value={advanced.hideOnPages}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Custom CSS">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Custom Styles</Label>
					<Textarea
						className="min-h-[120px] font-mono text-sm"
						onChange={(e) => onChange({ customCss: e.target.value })}
						placeholder=".widget-container { ... }"
						value={advanced.customCss}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="SDK Options">
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">Hide Launcher</Label>
					<Switch
						checked={advanced.hideLauncher}
						onCheckedChange={(v) => onChange({ hideLauncher: v })}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Programmatic Control
					</Label>
					<Switch
						checked={advanced.programmaticControl}
						onCheckedChange={(v) => onChange({ programmaticControl: v })}
					/>
				</div>
			</SectionGroup>
		</div>
	);
}
