import {
	CheckCircle2,
	ChevronLeft,
	Clock,
	Plus,
	Send,
	Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { useCMS } from "../provider";
import { fieldTypeIcons } from "./field-card";

function ContentFieldInput({
	field,
	value,
	onChange,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: Field is of any type
	field: any;
	value: unknown;
	onChange: (val: unknown) => void;
}) {
	const Icon = fieldTypeIcons[field.type as keyof typeof fieldTypeIcons];

	const renderInput = () => {
		switch (field.type) {
			case "text":
				return (
					<input
						className="field-input"
						onChange={(e) => onChange(e.target.value)}
						placeholder={field.config?.placeholder || `Enter ${field.label}...`}
						value={(value as string) || ""}
					/>
				);

			case "richtext":
				return (
					<textarea
						className="field-input resize-none"
						onChange={(e) => onChange(e.target.value)}
						placeholder={field.config?.placeholder || "Write content..."}
						rows={6}
						value={(value as string) || ""}
					/>
				);

			case "number":
				return (
					<input
						className="field-input font-mono"
						onChange={(e) =>
							onChange(e.target.value ? Number(e.target.value) : undefined)
						}
						type="number"
						value={(value as number) ?? ""}
					/>
				);

			case "boolean":
				return (
					<button
						className={`relative h-7 w-12 rounded-full transition-colors ${
							value ? "bg-primary" : "bg-secondary"
						}`}
						onClick={() => onChange(!value)}
					>
						<div
							className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${
								value ? "translate-x-6" : "translate-x-1"
							}`}
						/>
					</button>
				);

			case "date":
				return (
					<input
						className="field-input font-mono text-[14px]"
						onChange={(e) => onChange(e.target.value)}
						type="datetime-local"
						value={(value as string) || ""}
					/>
				);

			case "select":
				return (
					<select
						className="field-input"
						onChange={(e) => onChange(e.target.value)}
						value={(value as string) || ""}
					>
						<option value="">Select...</option>
						{(field.config?.options || []).map((opt: string) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				);

			case "color":
				return (
					<input
						onChange={(e) => onChange(e.target.value)}
						type="color"
						value={(value as string) || "#3b82f6"}
					/>
				);

			case "json":
				return (
					<textarea
						className="field-input font-mono text-[13px]"
						onChange={(e) => {
							try {
								onChange(JSON.parse(e.target.value));
							} catch {
								onChange(e.target.value);
							}
						}}
						rows={5}
						value={
							typeof value === "string"
								? value
								: JSON.stringify(value || {}, null, 2)
						}
					/>
				);

			default:
				return (
					<input
						className="field-input"
						onChange={(e) => onChange(e.target.value)}
						value={(value as string) || ""}
					/>
				);
		}
	};

	return (
		<div className="field-card">
			<div className="mb-1 flex items-center gap-2.5">
				<Icon className="h-4 w-4 text-muted-foreground" />
				<span className="field-label">{field.label}</span>
				{field.config?.required && (
					<span className="text-[11px] text-destructive">*</span>
				)}
			</div>

			{renderInput()}
		</div>
	);
}

export function ContentEditor() {
	const {
		getActiveCollection,
		getEntriesByCollection,
		activeEntryId,
		setActiveEntry,
		addEntry,
		updateEntry,
		deleteEntry,
		publishEntry,
	} = useCMS();

	const collection = getActiveCollection();
	const entries = collection ? getEntriesByCollection(collection.id) : [];

	const activeEntry = entries.find((e) => e.id === activeEntryId);

	const handleFieldChange = useCallback(
		(key: string, value: unknown) => {
			if (!activeEntryId) return;

			updateEntry(activeEntryId, {
				data: {
					...(activeEntry?.data || {}),
					[key]: value,
				},
			});
		},
		[activeEntryId, updateEntry, activeEntry]
	);

	if (!collection) {
		return (
			<div className="cms-stage flex items-center justify-center">
				<p className="text-[14px] text-muted-foreground">
					Select a collection to manage content.
				</p>
			</div>
		);
	}

	// ENTRY LIST
	if (!activeEntry) {
		return (
			<main className="cms-stage">
				<div className="mx-auto max-w-3xl">
					<header className="mb-8 flex items-center justify-between">
						<div>
							<span className="field-label">{collection.name}</span>
							<h1 className="mt-1 font-semibold text-2xl">Content Entries</h1>
						</div>

						<button
							className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
							onClick={() => addEntry(collection.id)}
						>
							<Plus className="h-4 w-4" />
							New Entry
						</button>
					</header>

					{entries.length === 0 ? (
						<div className="py-20 text-center">
							<p className="mb-4 text-muted-foreground">No entries yet</p>

							<button
								className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
								onClick={() => addEntry(collection.id)}
							>
								Create First Entry
							</button>
						</div>
					) : (
						<div className="space-y-2">
							<AnimatePresence>
								{entries.map((entry, i) => {
									const title = (entry.data.title ||
										entry.data.page_title ||
										entry.data.name ||
										`Entry ${i + 1}`) as string;

									return (
										<motion.div
											animate={{ opacity: 1, y: 0 }}
											className="field-card flex cursor-pointer items-center justify-between"
											exit={{ opacity: 0, y: -8 }}
											initial={{ opacity: 0, y: 8 }}
											key={entry.id}
											onClick={() => setActiveEntry(entry.id)}
											transition={{ delay: i * 0.03 }}
										>
											<div>
												<p className="font-medium">{title}</p>

												<p className="text-muted-foreground text-xs">
													Updated {entry.system.updatedAt.toLocaleDateString()}
												</p>
											</div>

											<div className="flex items-center gap-3">
												<span
													className={`status-badge ${
														entry.status === "published" ? "synced" : "draft"
													}`}
												>
													{entry.status === "published" ? (
														<>
															<CheckCircle2 className="h-3 w-3" /> Published
														</>
													) : (
														<>
															<Clock className="h-3 w-3" /> Draft
														</>
													)}
												</span>

												<button
													onClick={(e) => {
														e.stopPropagation();
														deleteEntry(entry.id);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</motion.div>
									);
								})}
							</AnimatePresence>
						</div>
					)}
				</div>
			</main>
		);
	}

	// ENTRY EDITOR
	return (
		<main className="cms-stage">
			<div className="mx-auto max-w-3xl">
				<header className="mb-10">
					<button
						className="mb-4 flex items-center gap-1.5 text-muted-foreground"
						onClick={() => setActiveEntry(null)}
					>
						<ChevronLeft className="h-4 w-4" />
						Back to entries
					</button>

					<div className="flex items-center justify-between">
						<h1 className="font-semibold text-2xl">
							{(activeEntry.data.title as string) || "Untitled Entry"}
						</h1>

						<button
							className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
							onClick={() => publishEntry(activeEntry.id)}
						>
							<Send className="h-3.5 w-3.5" />
							Publish
						</button>
					</div>
				</header>

				<div className="space-y-6">
					{/** biome-ignore lint/suspicious/noExplicitAny: Field can be any */}
					{collection.fields.map((field: any, i: number) => (
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 12 }}
							key={field.id}
							transition={{
								delay: i * 0.05,
								type: "spring",
								stiffness: 300,
								damping: 30,
							}}
						>
							<ContentFieldInput
								field={field}
								onChange={(val) => handleFieldChange(field.name, val)}
								value={activeEntry.data[field.name]}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}
