import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Slider } from "@zero-heads-lab/design-system/components/ui/slider";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import type { WidgetTheme } from "@zero-heads-lab/shared/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
	theme: WidgetTheme;
	onChange: (theme: Partial<WidgetTheme>) => void;
}

function SectionGroup({
	title,
	children,
	defaultOpen = true,
}: {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
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

function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<Label className="text-muted-foreground text-sm">{label}</Label>
			<div className="flex items-center gap-2">
				<input
					className="h-8 w-8 cursor-pointer rounded-md border border-input p-0.5"
					onChange={(e) => onChange(e.target.value)}
					type="color"
					value={value}
				/>
				<Input
					className="h-8 w-24 font-mono text-xs"
					onChange={(e) => onChange(e.target.value)}
					value={value}
				/>
			</div>
		</div>
	);
}

export function AppearanceTab({ theme, onChange }: Props) {
	return (
		<div className="space-y-1">
			<SectionGroup title="Branding">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Company Name</Label>
					<Input
						className="h-9"
						onChange={(e) => onChange({ companyName: e.target.value })}
						value={theme.companyName}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Header Title</Label>
					<Input
						className="h-9"
						onChange={(e) => onChange({ headerTitle: e.target.value })}
						value={theme.headerTitle}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Subtitle</Label>
					<Input
						className="h-9"
						onChange={(e) => onChange({ subtitle: e.target.value })}
						value={theme.subtitle}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Colors">
				<ColorField
					label="Primary Color"
					onChange={(v) => onChange({ primaryColor: v })}
					value={theme.primaryColor}
				/>
				<ColorField
					label="Background"
					onChange={(v) => onChange({ backgroundColor: v })}
					value={theme.backgroundColor}
				/>
				<ColorField
					label="Text Color"
					onChange={(v) => onChange({ textColor: v })}
					value={theme.textColor}
				/>
				<ColorField
					label="Header Color"
					onChange={(v) => onChange({ headerColor: v })}
					value={theme.headerColor}
				/>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Style">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-muted-foreground text-sm">
							Border Radius
						</Label>
						<span className="font-mono text-muted-foreground text-xs">
							{theme.borderRadius}px
						</span>
					</div>
					<Slider
						max={24}
						min={0}
						onValueChange={([v]) => onChange({ borderRadius: v })}
						step={2}
						value={[theme.borderRadius]}
					/>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-muted-foreground text-sm">
							Widget Width
						</Label>
						<span className="font-mono text-muted-foreground text-xs">
							{theme.widgetWidth}px
						</span>
					</div>
					<Slider
						max={480}
						min={320}
						onValueChange={([v]) => onChange({ widgetWidth: v })}
						step={10}
						value={[theme.widgetWidth]}
					/>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-muted-foreground text-sm">
							Widget Height
						</Label>
						<span className="font-mono text-muted-foreground text-xs">
							{theme.widgetHeight}px
						</span>
					</div>
					<Slider
						max={700}
						min={400}
						onValueChange={([v]) => onChange({ widgetHeight: v })}
						step={10}
						value={[theme.widgetHeight]}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">Shadow</Label>
					<Switch
						checked={theme.shadow}
						onCheckedChange={(v) => onChange({ shadow: v })}
					/>
				</div>
			</SectionGroup>
		</div>
	);
}
