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
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { WidgetConversation } from "@/types/widget";

interface Props {
	conversation: WidgetConversation;
	onChange: (conv: Partial<WidgetConversation>) => void;
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

export function ConversationTab({ conversation, onChange }: Props) {
	return (
		<div className="space-y-1">
			<SectionGroup title="Message UI">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Bubble Style</Label>
					<ToggleGroup
						className="justify-start"
						onValueChange={(v) =>
							v && onChange({ bubbleStyle: v as "rounded" | "square" })
						}
						type="single"
						value={conversation.bubbleStyle}
					>
						<ToggleGroupItem className="px-6 text-xs" value="rounded">
							Rounded
						</ToggleGroupItem>
						<ToggleGroupItem className="px-6 text-xs" value="square">
							Square
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
				<ColorField
					label="User Bubble"
					onChange={(v) => onChange({ userBubbleColor: v })}
					value={conversation.userBubbleColor}
				/>
				<ColorField
					label="Agent Bubble"
					onChange={(v) => onChange({ agentBubbleColor: v })}
					value={conversation.agentBubbleColor}
				/>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Header">
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Show Agent Avatar
					</Label>
					<Switch
						checked={conversation.showAgentAvatar}
						onCheckedChange={(v) => onChange({ showAgentAvatar: v })}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Show Online Status
					</Label>
					<Switch
						checked={conversation.showOnlineStatus}
						onCheckedChange={(v) => onChange({ showOnlineStatus: v })}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">Header Title</Label>
					<Input
						className="h-9"
						onChange={(e) => onChange({ headerTitle: e.target.value })}
						value={conversation.headerTitle}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Input">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Placeholder Text
					</Label>
					<Input
						className="h-9"
						onChange={(e) => onChange({ placeholderText: e.target.value })}
						value={conversation.placeholderText}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Send Button Style
					</Label>
					<ToggleGroup
						className="justify-start"
						onValueChange={(v) =>
							v && onChange({ sendButtonStyle: v as "icon" | "text" })
						}
						type="single"
						value={conversation.sendButtonStyle}
					>
						<ToggleGroupItem className="px-6 text-xs" value="icon">
							Icon
						</ToggleGroupItem>
						<ToggleGroupItem className="px-6 text-xs" value="text">
							Text
						</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</SectionGroup>
		</div>
	);
}
