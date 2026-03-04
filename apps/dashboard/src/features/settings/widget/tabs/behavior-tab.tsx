import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@zero-heads-lab/design-system/components/ui/collapsible";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { Textarea } from "@zero-heads-lab/design-system/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { WidgetBehavior } from "@/types/widget";

interface Props {
	behavior: WidgetBehavior;
	onChange: (behavior: Partial<WidgetBehavior>) => void;
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

export function BehaviorTab({ behavior, onChange }: Props) {
	return (
		<div className="space-y-1">
			<SectionGroup title="Welcome Behavior">
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Auto Open Chat
					</Label>
					<Switch
						checked={behavior.autoOpenChat}
						onCheckedChange={(v) => onChange({ autoOpenChat: v })}
					/>
				</div>
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Welcome Message
					</Label>
					<Textarea
						className="min-h-[60px] text-sm"
						onChange={(e) => onChange({ welcomeMessage: e.target.value })}
						value={behavior.welcomeMessage}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Chat Settings">
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Enable Attachments
					</Label>
					<Switch
						checked={behavior.enableAttachments}
						onCheckedChange={(v) => onChange({ enableAttachments: v })}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Enable Emoji Picker
					</Label>
					<Switch
						checked={behavior.enableEmojiPicker}
						onCheckedChange={(v) => onChange({ enableEmojiPicker: v })}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Enable Typing Indicator
					</Label>
					<Switch
						checked={behavior.enableTypingIndicator}
						onCheckedChange={(v) => onChange({ enableTypingIndicator: v })}
					/>
				</div>
			</SectionGroup>

			<div className="border-border border-t" />

			<SectionGroup title="Offline Mode">
				<div className="space-y-2">
					<Label className="text-muted-foreground text-sm">
						Offline Message
					</Label>
					<Textarea
						className="min-h-[60px] text-sm"
						onChange={(e) => onChange({ offlineMessage: e.target.value })}
						value={behavior.offlineMessage}
					/>
				</div>
				<div className="flex items-center justify-between">
					<Label className="text-muted-foreground text-sm">
						Show Email Form When Offline
					</Label>
					<Switch
						checked={behavior.showEmailFormOffline}
						onCheckedChange={(v) => onChange({ showEmailFormOffline: v })}
					/>
				</div>
			</SectionGroup>
		</div>
	);
}
