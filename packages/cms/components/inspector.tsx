import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { ArrowDown, ArrowLeft, Eye, Maximize2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { animationPresets } from "../default";
import { useCMS } from "../provider";
import type { EffectPreset } from "../types";

const motionIcons: Record<EffectPreset, React.ElementType> = {
	none: Eye,
	fade: Sparkles,
	"slide-up": ArrowDown,
	"slide-left": ArrowLeft,
	scale: Maximize2,
	reveal: Eye,
};

export function CMSInspector() {
	const { getActiveField, getActiveCollection, activeFieldId, updateField } =
		useCMS();
	const field = getActiveField();
	const collection = getActiveCollection();

	if (!(field && collection)) {
		return (
			<aside className="flex h-full w-[300px] shrink-0 items-center justify-center border-border border-l bg-card">
				<p className="px-8 text-center text-[13px] text-muted-foreground/60">
					Select a field to configure its properties and animations
				</p>
			</aside>
		);
	}

	const handleUpdate = (updates: Record<string, unknown>) => {
		updateField(collection.id, field.id, updates);
	};

	const handleConfigUpdate = (configUpdates: Record<string, unknown>) => {
		updateField(collection.id, field.id, {
			config: { ...field.config, ...configUpdates },
		});
	};

	return (
		<motion.aside
			animate={{ opacity: 1, x: 0 }}
			className="flex h-full w-[300px] shrink-0 flex-col overflow-y-auto border-border border-l bg-card"
			initial={{ opacity: 0, x: 20 }}
			key={activeFieldId}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
		>
			<div className="border-border border-b p-5">
				<p className="mt-1 font-medium text-[15px] text-foreground tracking-tight">
					{field.label}
				</p>
			</div>

			<div className="space-y-0 p-5">
				{/* Basic Properties */}
				<div className="inspector-section">
					<span className="field-label mb-3 block">Properties</span>
					<div className="space-y-3">
						<div>
							<Label className="mb-1 block text-[12px] text-muted-foreground">
								Label
							</Label>
							<Input
								className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary/30"
								onChange={(e) => handleUpdate({ label: e.target.value })}
								value={field.label}
							/>
						</div>
						<div>
							<Label className="mb-1 block text-[12px] text-muted-foreground">
								Key
							</Label>
							<Input
								className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary/30"
								onChange={(e) => handleUpdate({ key: e.target.value })}
								value={field.id}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label className="text-[12px] text-muted-foreground">
								Required
							</Label>
							<Button
								className={`relative h-6 w-10 rounded-full transition-colors ${
									field.config?.required ? "bg-primary" : "bg-secondary"
								}`}
								onClick={() =>
									handleConfigUpdate({ required: !field.config?.required })
								}
							>
								<div
									className={`absolute top-1 h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${
										field.config?.required ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</Button>
						</div>
						{field.config?.placeholder !== undefined && (
							<div>
								<Label className="mb-1 block text-[12px] text-muted-foreground">
									Placeholder
								</Label>
								<Input
									className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary/30"
									onChange={(e) =>
										handleConfigUpdate({ placeholder: e.target.value })
									}
									value={field.config?.placeholder || ""}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Animation */}
				<div className="inspector-section">
					<span className="field-label mb-3 block">Motion Preset</span>
					<div className="grid grid-cols-3 gap-2">
						{animationPresets.map((preset) => {
							const Icon = motionIcons[preset.value];
							const isSelected =
								field.config?.animation?.effect === preset.value;
							return (
								<button
									className={`motion-preset ${isSelected ? "selected" : ""}`}
									key={preset.value}
									onClick={() =>
										handleConfigUpdate({ animation: preset.value })
									}
								>
									<Icon className="h-4 w-4" />
									<span className="font-medium text-[10px]">
										{preset.label}
									</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Animation Config */}
				{field.config?.animation?.effect !== "none" && (
					<motion.div
						animate={{ opacity: 1, height: "auto" }}
						className="inspector-section"
						initial={{ opacity: 0, height: 0 }}
					>
						<span className="field-label mb-3 block">Animation Config</span>
						<div className="space-y-3">
							<div>
								<div className="mb-1 flex items-center justify-between">
									<Label className="text-[12px] text-muted-foreground">
										Delay
									</Label>
									<span className="font-mono text-[11px] text-muted-foreground">
										{field.config?.animation?.delay}s
									</span>
								</div>
								<input
									className="w-full accent-primary"
									max="2"
									min="0"
									onChange={(e) =>
										handleConfigUpdate({
											delay: Number.parseFloat(e.target.value),
										})
									}
									step="0.1"
									type="range"
									value={field.config?.animation?.delay}
								/>
							</div>
							<div>
								<div className="mb-1 flex items-center justify-between">
									<Label className="text-[12px] text-muted-foreground">
										Threshold
									</Label>
									<span className="font-mono text-[11px] text-muted-foreground">
										{field.config?.animation?.threshold}
									</span>
								</div>
								<input
									className="w-full accent-primary"
									max="1"
									min="0"
									onChange={(e) =>
										handleConfigUpdate({
											threshold: Number.parseFloat(e.target.value),
										})
									}
									step="0.1"
									type="range"
									value={field.config?.animation?.threshold}
								/>
							</div>
						</div>
					</motion.div>
				)}

				{/* Select Options */}
				{field.type === "select" && (
					<div className="inspector-section">
						<span className="field-label mb-3 block">Options</span>
						<div className="space-y-2">
							{(field.config?.options || []).map((opt, i) => (
								<div className="flex gap-2" key={i}>
									<input
										className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary/30"
										onChange={(e) => {
											const opts = [...(field.config?.options || [])];
											opts[i] = e.target.value;
											handleConfigUpdate({ options: opts });
										}}
										value={opt}
									/>
									<button
										className="rounded px-2 text-[12px] text-destructive transition-colors hover:bg-destructive/10"
										onClick={() => {
											const opts = (field.config?.options || []).filter(
												(_, j) => j !== i
											);
											handleConfigUpdate({ options: opts });
										}}
									>
										×
									</button>
								</div>
							))}
							<button
								className="w-full rounded-lg border border-border border-dashed py-1.5 text-[12px] text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
								onClick={() =>
									handleConfigUpdate({
										options: [...(field.config?.options || []), ""],
									})
								}
							>
								+ Add option
							</button>
						</div>
					</div>
				)}

				{/* Schema Preview */}
				<div className="inspector-section">
					<span className="field-label mb-3 block">Schema (JSON)</span>
					<pre className="overflow-x-auto rounded-lg bg-secondary p-3 font-mono text-[11px] text-muted-foreground">
						{JSON.stringify(
							{
								field_id: field.id,
								type: field.type,
								label: field.label,
								config: field.config,
							},
							null,
							2
						)}
					</pre>
				</div>
			</div>
		</motion.aside>
	);
}
