import { Keyboard, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { FieldType } from "@/types";
import { useCMS } from "../provider";
import { AddFieldPanel, FieldCard } from "./field-card";

export function SchemaEditor() {
	const {
		getActiveCollection,
		activeCollectionId,
		activeFieldId,
		setActiveField,
		addField,
		removeField,
	} = useCMS();
	const [showAddField, setShowAddField] = useState(false);
	const collection = getActiveCollection();

	const handleAddField = (type: FieldType) => {
		if (!activeCollectionId) return;
		const label = `${type.charAt(0).toUpperCase() + type.slice(1)} Field`;
		const key = label.toLowerCase().replace(/\s+/g, "_");
		addField(activeCollectionId, {
			type,
			label,
			name: key,
			config: {
				animation: {
					effect: "fade",
					delay: 0,
					threshold: 0.5,
				},
				required: false,
				placeholder: `Enter ${type}...`,
			},
		});
		setShowAddField(false);
	};

	if (!collection) {
		return (
			<div className="cms-stage flex items-center justify-center">
				<div className="max-w-md text-center">
					<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
						<Keyboard className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="mb-2 font-semibold text-foreground text-xl tracking-tight">
						Select a collection
					</h2>
					<p className="text-[14px] text-muted-foreground">
						Choose a collection from the sidebar or create a new one to start
						defining your schema.
					</p>
				</div>
			</div>
		);
	}

	return (
		<main className="cms-stage">
			<div className="mx-auto max-w-3xl">
				{/* Header */}
				<header className="mb-12">
					<div className="mb-2 flex items-center gap-3">
						<span className="field-label">{collection.slug}</span>
						<span className="text-[11px] text-muted-foreground/40">·</span>
						<span className="field-label">
							{collection.fields.length} fields
						</span>
					</div>
					<h1 className="font-semibold text-3xl text-foreground tracking-tight">
						{collection.name}
					</h1>
					<p className="mt-1 text-[15px] text-muted-foreground">
						Define the schema and animation behavior for each field.
					</p>
				</header>

				{/* Fields */}
				<div className="space-y-4">
					<AnimatePresence mode="popLayout">
						{/** biome-ignore lint/suspicious/noExplicitAny: Field can be any */}
						{collection.fields.map((field: any, i: number) => (
							<FieldCard
								field={field}
								index={i}
								isActive={activeFieldId === field.id}
								key={field.id}
								onClick={() => setActiveField(field.id)}
								onRemove={() => removeField(collection.id, field.id)}
							/>
						))}
					</AnimatePresence>
				</div>

				{/* Add Field */}
				<div className="mt-8">
					<AnimatePresence>
						{showAddField ? (
							<AddFieldPanel
								onAdd={handleAddField}
								onClose={() => setShowAddField(false)}
							/>
						) : (
							<motion.button
								animate={{ opacity: 1 }}
								className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border border-dashed py-4 font-medium text-[13px] text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
								initial={{ opacity: 0 }}
								onClick={() => setShowAddField(true)}
							>
								<Plus className="h-4 w-4" />
								Add field · Press{" "}
								<kbd className="ml-1 rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">
									A
								</kbd>
							</motion.button>
						)}
					</AnimatePresence>

					{collection.fields.length === 0 && !showAddField && (
						<p className="mt-6 text-center text-[13px] text-muted-foreground/60">
							This collection is a blank canvas. Press{" "}
							<kbd className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">
								A
							</kbd>{" "}
							to add your first field.
						</p>
					)}
				</div>
			</div>
		</main>
	);
}
