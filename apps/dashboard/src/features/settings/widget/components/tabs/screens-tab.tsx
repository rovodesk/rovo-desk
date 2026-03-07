/** biome-ignore-all lint/style/noNestedTernary: Need for UI */
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	type UniqueIdentifier,
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
	Block,
	BlockConfigMap,
	BlockType,
	WidgetConfig,
	WidgetScreenConfig,
} from "@zero-heads-lab/shared/types";
import {
	BookOpen,
	ChevronDown,
	ChevronUp,
	GripVertical,
	Megaphone,
	MessageCircle,
	MessageSquare,
} from "lucide-react";
import { useState } from "react";

const blockTypeInfo: Record<
	BlockType,
	{ label: string; icon: React.ElementType }
> = {
	welcome: { label: "Welcome Message", icon: MessageCircle },
	conversation: {
		label: "Conversation",
		icon: MessageSquare,
	},
	knowledge_base: { label: "Knowledge Base", icon: BookOpen },
	publications: { label: "Publications", icon: Megaphone },
};

function SortableBlock({
	block,
	onUpdate,
}: {
	block: Block;
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
	block: Block;
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
		case "publications":
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
		default:
			return null;
	}
}

export function ScreensTab({
	screens,
	onChange,
}: {
	screens: WidgetScreenConfig;
	onChange: (screens: WidgetScreenConfig) => void;
}) {
	const [tab, setTab] = useState<"visitor" | "user">("visitor");
	console.log("Screens", screens);

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
				onValueChange={(v) => setTab(v as "visitor" | "user")}
				value={tab}
			>
				<TabsList>
					<TabsTrigger value="visitor">Visitors</TabsTrigger>
					<TabsTrigger value="user">Users</TabsTrigger>
				</TabsList>

				<TabsContent value="visitor">
					<Editor onChange={onChange} screens={screens} tab="visitor" />
				</TabsContent>
				<TabsContent value="user">
					<Editor onChange={onChange} screens={screens} tab="user" />
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
	tab: "visitor" | "user";
}) => {
	const modeConfig = screens[tab];

	if (!modeConfig) return null;

	return (
		<div className="space-y-3">
			{modeConfig.screens.map(
				(
					screen: WidgetScreenConfig["visitor"]["screens"][0],
					index: number
				) => (
					<ScreenEditor
						key={screen.id}
						modeConfig={modeConfig}
						onChange={onChange}
						screen={screen}
						screenIndex={index}
						screens={screens}
						tab={tab}
					/>
				)
			)}
		</div>
	);
};

const ScreenEditor = ({
	screen,
	screenIndex,
	modeConfig,
	screens,
	onChange,
	tab,
}: {
	screen: WidgetScreenConfig["visitor"]["screens"][0];
	screenIndex: number;
	modeConfig: WidgetScreenConfig["visitor"];
	screens: WidgetConfig["screens"];
	onChange: (screens: WidgetConfig["screens"]) => void;
	tab: "visitor" | "user";
}) => {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const blocks = screen?.blocks ?? [];

	const updateBlocks = (newBlocks: Block[]) => {
		const newScreens = [...modeConfig.screens];

		newScreens[screenIndex] = {
			...screen,
			blocks: newBlocks,
		};

		onChange({
			...screens,
			[tab]: {
				...modeConfig,
				screens: newScreens,
			},
		});
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = blocks.findIndex(
			(b: { id: UniqueIdentifier }) => b.id === active.id
		);
		const newIndex = blocks.findIndex(
			(b: { id: UniqueIdentifier }) => b.id === over.id
		);

		updateBlocks(arrayMove(blocks, oldIndex, newIndex));
	};

	const updateBlock = (id: string, config: Record<string, unknown>) => {
		updateBlocks(
			blocks.map((b: Block) =>
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
		<div>
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				sensors={sensors}
			>
				<SortableContext
					items={blocks.map((b: { id: string }) => b.id)}
					strategy={verticalListSortingStrategy}
				>
					{blocks.map((block: Block<keyof BlockConfigMap>) => (
						<SortableBlock
							block={block}
							key={block.id}
							onUpdate={(config) => updateBlock(block.id, config)}
						/>
					))}
				</SortableContext>
			</DndContext>
		</div>
	);
};
