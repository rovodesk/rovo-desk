import { useCMS } from "@zero-heads-lab/cms/provider";
import {
	ChevronRight,
	Database,
	FileText,
	Folder,
	Layers,
	Layout,
	Plus,
	Settings,
	Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useDashboardLayout } from "@/layout";

const iconMap: Record<string, React.ElementType> = {
	FileText,
	Layout,
	Folder,
	Database,
	Settings,
	Layers,
};

export function CMSNavigation() {
	const {
		collections = [],
		entries = [],
		activeCollectionId,
		setActiveCollection,
		addCollection,
		deleteCollection,
		view,
		setView,
	} = useCMS();

	const [newName, setNewName] = useState("");
	const [showAdd, setShowAdd] = useState(false);

	const { setRightSidebarOpen } = useDashboardLayout();

	const handleAdd = () => {
		const name = newName.trim();
		if (!name) return;

		addCollection(name);
		setNewName("");
		setShowAdd(false);
	};

	const totalEntries = entries.length;

	return (
		<div className="flex h-full w-[280px] shrink-0 flex-col border-border border-r bg-card">
			{/* Header */}
			<div className="border-border border-b p-5">
				<div className="flex items-center gap-2.5">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
						<Layers className="h-4 w-4 text-primary-foreground" />
					</div>

					<span className="font-semibold text-[15px] text-foreground tracking-tight">
						Schema CMS
					</span>
				</div>
			</div>

			{/* View Tabs */}
			<div className="px-3 pt-4 pb-2">
				<div className="flex gap-1 rounded-lg bg-secondary p-1">
					{(["schema", "content"] as const).map((v) => (
						<button
							className={`flex-1 rounded-md py-1.5 font-medium text-[12px] capitalize transition-all ${
								view === v
									? "bg-card text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
							key={v}
							onClick={() => setView(v)}
						>
							{v === "schema" ? "Schema" : "Content"}
						</button>
					))}
				</div>
			</div>

			{/* Collections */}
			<div className="flex-1 overflow-y-auto px-3 py-2">
				<div className="mb-2 flex items-center justify-between px-3">
					<span className="field-label">Collections</span>

					<button
						className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
						onClick={() => setShowAdd((v) => !v)}
					>
						<Plus className="h-3.5 w-3.5" />
					</button>
				</div>

				<AnimatePresence initial={false}>
					{showAdd && (
						<motion.div
							animate={{ opacity: 1, height: "auto" }}
							className="mb-2 overflow-hidden"
							exit={{ opacity: 0, height: 0 }}
							initial={{ opacity: 0, height: 0 }}
						>
							<div className="flex gap-2 px-1">
								<input
									autoFocus
									className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-[13px] text-foreground outline-none focus:ring-1 focus:ring-primary/30"
									onChange={(e) => setNewName(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleAdd()}
									placeholder="Collection name..."
									value={newName}
								/>

								<button
									className="rounded-md bg-primary px-3 py-1.5 font-medium text-[12px] text-primary-foreground hover:opacity-90"
									onClick={handleAdd}
								>
									Add
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				<nav className="space-y-0.5">
					{collections?.map((col) => {
						const Icon = iconMap[col.icon as string] ?? Folder;
						const isActive = activeCollectionId === col.id;

						const entryCount = entries.filter(
							(e) => e.collectionId === col.id
						).length;

						return (
							<motion.div
								animate={{ opacity: 1, x: 0 }}
								className="group relative"
								initial={{ opacity: 0, x: -10 }}
								key={col.id}
							>
								<button
									className={`cms-nav-item w-full ${isActive ? "active" : ""}`}
									onClick={() => {
										setActiveCollection(col.id);
										setRightSidebarOpen(true);
									}}
								>
									<Icon className="h-4 w-4 shrink-0" />

									<span className="flex-1 truncate text-left">{col.name}</span>

									<span className="text-[11px] text-muted-foreground/60">
										{col.fields.length}f · {entryCount}e
									</span>

									<ChevronRight
										className={`h-3.5 w-3.5 text-muted-foreground/40 transition-transform ${
											isActive ? "rotate-90" : ""
										}`}
									/>
								</button>

								<button
									className="absolute top-1/2 right-1 -translate-y-1/2 rounded p-1 opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
									onClick={(e) => {
										e.stopPropagation();
										deleteCollection(col.id);
									}}
								>
									<Trash2 className="h-3 w-3" />
								</button>
							</motion.div>
						);
					})}
				</nav>
			</div>

			{/* Footer */}
			<div className="border-border border-t p-4">
				<div className="text-[11px] text-muted-foreground/60">
					{collections.length} collections · {totalEntries} entries
				</div>
			</div>
		</div>
	);
}
