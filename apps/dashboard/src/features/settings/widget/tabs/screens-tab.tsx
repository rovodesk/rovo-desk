/** biome-ignore-all lint/style/noNestedTernary: Need for UI */
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@zero-heads-lab/design-system/components/ui/card";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import type {
	HomeBlock,
	HomeBlockType,
	WidgetConfig,
	WidgetScreens,
} from "@zero-heads-lab/shared/types";
import {
	BookOpen,
	ChevronDown,
	ChevronUp,
	GripVertical,
	Megaphone,
	MessageCircle,
	MessageSquare,
	Phone,
} from "lucide-react";
import { useState } from "react";

interface Props {
	screens: WidgetScreens;
	onChange: (screens: WidgetScreens) => void;
}

const blockTypeInfo: Record<
	HomeBlockType,
	{ label: string; icon: React.ElementType }
> = {
	welcome: { label: "Welcome Message", icon: MessageCircle },
	conversation: {
		label: "Conversation",
		icon: MessageSquare,
	},
	knowledge_base: { label: "Knowledge Base", icon: BookOpen },
	announcement: { label: "Announcement", icon: Megaphone },
	cta: { label: "Contact Button", icon: Phone },
};

function SortableBlock({
	block,
	onUpdate,
}: {
	block: HomeBlock;
	onUpdate: (config: Record<string, unknown>) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: block.id });
	const [expanded, setExpanded] = useState(false);
	const info = blockTypeInfo[block.type];
	const Icon = info.icon;

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const isConversation = block.type === "conversation";

	return (
		<Card
			className="border border-border bg-card"
			ref={setNodeRef}
			style={style}
		>
			<div className="flex items-center gap-2 p-3">
				<button
					{...attributes}
					{...listeners}
					className="cursor-grab text-muted-foreground hover:text-foreground"
				>
					<GripVertical className="h-4 w-4" />
				</button>

				<Icon className="h-4 w-4 text-muted-foreground" />

				<span className="flex-1 font-medium text-sm">{info.label}</span>

				{!isConversation && (
					<Switch
						checked={block.enabled}
						className="scale-75"
						onCheckedChange={(v) => onUpdate({ ...block.config, _enabled: v })}
					/>
				)}

				{!isConversation && (
					<button
						className="text-muted-foreground text-xs hover:underline"
						onClick={() => setExpanded(!expanded)}
					>
						{expanded ? (
							<ChevronUp className="h-4 w-4" />
						) : (
							<ChevronDown className="h-4 w-4" />
						)}
					</button>
				)}

				{isConversation && (
					<span className="text-muted-foreground text-xs">Required</span>
				)}
			</div>

			{!isConversation && expanded && (
				<div className="space-y-3 border-border border-t px-3 pt-0 pb-3">
					<BlockConfigEditor block={block} onUpdate={onUpdate} />
				</div>
			)}
		</Card>
	);
}

function BlockConfigEditor({
	block,
	onUpdate,
}: {
	block: HomeBlock;
	onUpdate: (config: Record<string, unknown>) => void;
}) {
	const cfg = block.config;
	switch (block.type) {
		case "welcome":
			return (
				<>
					<div className="space-y-1.5 pt-3">
						<Label className="text-muted-foreground text-xs">Title</Label>
						<Input
							className="h-8 text-sm"
							onChange={(e) => onUpdate({ ...cfg, title: e.target.value })}
							value={(cfg.title as string) || ""}
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-muted-foreground text-xs">Subtitle</Label>
						<Input
							className="h-8 text-sm"
							onChange={(e) => onUpdate({ ...cfg, subtitle: e.target.value })}
							value={(cfg.subtitle as string) || ""}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-muted-foreground text-xs">Show Avatar</Label>
						<Switch
							checked={!!cfg.showAvatar}
							className="scale-75"
							onCheckedChange={(v) => onUpdate({ ...cfg, showAvatar: v })}
						/>
					</div>
				</>
			);
		case "knowledge_base":
			return (
				<>
					<div className="space-y-1.5 pt-3">
						<Label className="text-muted-foreground text-xs">
							Article Limit
						</Label>
						<Input
							className="h-8 text-sm"
							onChange={(e) =>
								onUpdate({ ...cfg, articleLimit: +e.target.value })
							}
							type="number"
							value={(cfg.articleLimit as number) || 5}
						/>
					</div>
					<div className="space-y-1.5">
						<Label className="text-muted-foreground text-xs">Category</Label>
						<Select
							onValueChange={(v) => onUpdate({ ...cfg, category: v })}
							value={(cfg.category as string) || "All"}
						>
							<SelectTrigger className="h-8 text-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="All">All</SelectItem>
								<SelectItem value="Getting Started">Getting Started</SelectItem>
								<SelectItem value="Billing">Billing</SelectItem>
								<SelectItem value="Technical">Technical</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</>
			);
		case "conversation":
			return (
				<div className="space-y-1.5 pt-3">
					<Label className="text-muted-foreground text-xs">Button Label</Label>
					<Input
						className="h-8 text-sm"
						onChange={(e) => onUpdate({ ...cfg, label: e.target.value })}
						value={(cfg.label as string) || ""}
					/>
				</div>
			);
		case "announcement":
			return (
				<div className="space-y-1.5 pt-3">
					<Label className="text-muted-foreground text-xs">
						Announcement Text
					</Label>
					<Input
						className="h-8 text-sm"
						onChange={(e) => onUpdate({ ...cfg, text: e.target.value })}
						value={(cfg.text as string) || ""}
					/>
				</div>
			);
		case "cta":
			return (
				<div className="space-y-1.5 pt-3">
					<Label className="text-muted-foreground text-xs">Button Text</Label>
					<Input
						className="h-8 text-sm"
						onChange={(e) => onUpdate({ ...cfg, text: e.target.value })}
						value={(cfg.text as string) || "Contact Us"}
					/>
				</div>
			);
		default:
			return null;
	}
}

export function ScreensTab({ screens, onChange }: Props) {
	const [tab, setTab] = useState<"visitors" | "users">("visitors");

	return (
		<div className="space-y-4">
			<div>
				<h4 className="mb-1 font-semibold text-foreground text-sm">
					Screen Blocks
				</h4>
				<p className="text-muted-foreground text-xs">
					Configure what visitors and returning users see.
				</p>
			</div>

			<Tabs
				className="space-y-4"
				onValueChange={(v) => setTab(v as "visitors" | "users")}
				value={tab}
			>
				<TabsList>
					<TabsTrigger value="visitors">Visitors</TabsTrigger>
					<TabsTrigger value="users">Users</TabsTrigger>
				</TabsList>

				<TabsContent value="visitors">
					<Editor onChange={onChange} screens={screens} tab="visitors" />
				</TabsContent>
				<TabsContent value="users">
					<Editor onChange={onChange} screens={screens} tab="users" />
				</TabsContent>
			</Tabs>
		</div>
	);
}

const Editor = ({
	screens,
	onChange,
	tab,
}: {
	screens: WidgetConfig["screens"];
	onChange: (screens: WidgetConfig["screens"]) => void;
	tab: "visitors" | "users";
}) => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const blocks = screens[tab];

	const updateBlocks = (newBlocks: HomeBlock[]) => {
		onChange({
			...screens,
			[tab]: newBlocks,
		});
	};
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = blocks.findIndex((b) => b.id === active.id);
		const newIndex = blocks.findIndex((b) => b.id === over.id);

		updateBlocks(arrayMove(blocks, oldIndex, newIndex));
	};

	const updateBlock = (id: string, config: Record<string, unknown>) => {
		updateBlocks(
			blocks.map((b) =>
				b.id === id
					? {
							...b,
							config,
							enabled:
								config._enabled !== undefined ? !!config._enabled : b.enabled,
						}
					: b
			)
		);
	};

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			sensors={sensors}
		>
			<SortableContext
				items={blocks.map((b) => b.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className="space-y-2">
					{blocks.map((block) => (
						<SortableBlock
							block={block}
							key={block.id}
							onUpdate={(config) => updateBlock(block.id, config)}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};
