import {
	Calendar,
	Code,
	Hash,
	Image,
	Link,
	List,
	ListCheck,
	MoveVertical,
	Notebook,
	Palette,
	ToggleLeft,
	ToyBrick,
	Type,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import type { AnimationConfig, EffectPreset, FieldType } from "../types";

const fieldTypeIcons: Record<FieldType, React.ElementType> = {
	text: Type,
	richtext: Type,
	number: Hash,
	boolean: ToggleLeft,
	date: Calendar,
	media: Image,
	json: Code,
	select: List,
	relation: Link,
	color: Palette,
	textarea: Notebook,
	blocks: ToyBrick,
	array: ListCheck,
};

const animationPresets: { value: EffectPreset; label: string }[] = [
	{ value: "none", label: "None" },
	{ value: "fade", label: "Fade" },
	{ value: "slide-up", label: "Slide Up" },
	{ value: "slide-left", label: "Slide Left" },
	{ value: "scale", label: "Scale" },
	{ value: "reveal", label: "Reveal" },
];

const fieldVariants = {
	hidden: { opacity: 0, y: 12 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			type: "spring" as const,
			stiffness: 300,
			damping: 30,
			delay: i * 0.05,
		},
	}),
	exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

interface FieldCardProps {
	field: {
		id: string;
		type: FieldType;
		label: string;
		config: { animation?: AnimationConfig; required?: boolean };
	};
	index: number;
	isActive: boolean;
	onClick: () => void;
	onRemove: () => void;
}

export function FieldCard({
	field,
	index,
	isActive,
	onClick,
	onRemove,
}: FieldCardProps) {
	const Icon = fieldTypeIcons[field.type] || Type;

	const animationEffect = field.config?.animation?.effect;

	return (
		<motion.div
			animate="visible"
			className={`field-card group relative cursor-pointer ${isActive ? "active" : ""}`}
			custom={index}
			exit="exit"
			initial="hidden"
			layout
			onClick={onClick}
			variants={fieldVariants}
		>
			{/* Drag handle */}
			<div className="absolute top-1/2 left-2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-40">
				<MoveVertical className="h-4 w-4 text-muted-foreground" />
			</div>

			<div className="pl-4">
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
							<Icon className="h-4 w-4 text-muted-foreground" />
						</div>
						<div>
							<span className="field-label">{field.type}</span>
							<p className="mt-0.5 font-medium text-[15px] text-foreground leading-none tracking-tight">
								{field.label}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{animationEffect && animationEffect !== "none" && (
							<span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-[10px] text-primary">
								{animationEffect}
							</span>
						)}
						{field.config.required && (
							<span className="rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-[10px] text-destructive">
								required
							</span>
						)}
						<button
							className="rounded p-1 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>

				<div className="font-mono text-[12px] text-muted-foreground">
					{`{{ ${field.id} }}`}
				</div>
			</div>
		</motion.div>
	);
}

// ─── Add Field Panel ─────────────────────────────────────────────────────────

const fieldTypes: { type: FieldType; label: string; description: string }[] = [
	{ type: "text", label: "Text", description: "Single or multi-line text" },
	{
		type: "richtext",
		label: "Rich Text",
		description: "Formatted content editor",
	},
	{ type: "number", label: "Number", description: "Integer or decimal values" },
	{ type: "boolean", label: "Toggle", description: "True or false switch" },
	{ type: "date", label: "Date", description: "Date and time picker" },
	{ type: "media", label: "Media", description: "Images, videos, files" },
	{ type: "json", label: "JSON", description: "Raw structured data" },
	{ type: "select", label: "Select", description: "Dropdown with options" },
	{ type: "relation", label: "Relation", description: "Link to another entry" },
	{ type: "color", label: "Color", description: "Color picker value" },
];

interface AddFieldPanelProps {
	onAdd: (type: FieldType) => void;
	onClose: () => void;
}

export function AddFieldPanel({ onAdd, onClose }: AddFieldPanelProps) {
	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="rounded-xl border border-border bg-card p-4 shadow-lg"
			exit={{ opacity: 0, y: 20 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<div className="mb-3 flex items-center justify-between">
				<span className="font-semibold text-[13px] text-foreground">
					Add Field
				</span>
				<button className="rounded p-1 hover:bg-secondary" onClick={onClose}>
					<X className="h-4 w-4 text-muted-foreground" />
				</button>
			</div>
			<div className="grid grid-cols-2 gap-2">
				{fieldTypes.map((ft) => {
					const Icon = fieldTypeIcons[ft.type];
					return (
						<button
							className="group flex items-center gap-3 rounded-lg border border-transparent p-3 text-left transition-all hover:border-border hover:bg-secondary/50"
							key={ft.type}
							onClick={() => onAdd(ft.type)}
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
								<Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
							</div>
							<div>
								<p className="font-medium text-[13px] text-foreground">
									{ft.label}
								</p>
								<p className="text-[11px] text-muted-foreground">
									{ft.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</motion.div>
	);
}

// ─── Animation Presets for Inspector ─────────────────────────────────────────

export { animationPresets, fieldTypeIcons };
