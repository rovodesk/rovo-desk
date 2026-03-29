import { cn } from "@zero-heads-lab/design-system/lib/utils";

export function ThemePreview({ type }: { type: "light" | "dark" }) {
	const isDark = type === "dark";
	return (
		<div
			className={cn(
				"pointer-events-none flex aspect-4/3 w-full select-none overflow-hidden rounded-lg border shadow-sm transition-colors duration-300",
				isDark ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-white"
			)}
		>
			{/* Sidebar */}
			<div
				className={cn(
					"flex h-full w-1/4 flex-col gap-2 border-r p-2",
					isDark
						? "border-slate-800 bg-slate-900/50"
						: "border-slate-100 bg-slate-50"
				)}
			>
				<div
					className={cn(
						"h-2 w-6 rounded-full",
						isDark ? "bg-slate-700" : "bg-slate-300"
					)}
				/>
				<div className="mt-2 space-y-1">
					<div
						className={cn(
							"h-1.5 w-full rounded-full opacity-40",
							isDark ? "bg-slate-700" : "bg-slate-300"
						)}
					/>
					<div
						className={cn(
							"h-1.5 w-3/4 rounded-full opacity-40",
							isDark ? "bg-slate-700" : "bg-slate-300"
						)}
					/>
					<div
						className={cn(
							"h-1.5 w-5/6 rounded-full opacity-40",
							isDark ? "bg-slate-700" : "bg-slate-300"
						)}
					/>
				</div>
			</div>
			{/* Main Content */}
			<div className="flex flex-1 flex-col gap-3 p-3">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div
						className={cn(
							"h-2 w-16 rounded-full",
							isDark ? "bg-slate-700" : "bg-slate-300"
						)}
					/>
					<div
						className={cn(
							"size-4 rounded-full",
							isDark ? "bg-slate-800" : "bg-slate-100"
						)}
					/>
				</div>
				{/* Content Cards */}
				<div className="grid grid-cols-2 gap-2">
					<div
						className={cn(
							"h-12 rounded border",
							isDark
								? "border-slate-800 bg-slate-900"
								: "border-slate-100 bg-slate-50"
						)}
					/>
					<div
						className={cn(
							"h-12 rounded border",
							isDark
								? "border-slate-800 bg-slate-900"
								: "border-slate-100 bg-slate-50"
						)}
					/>
				</div>
				<div
					className={cn(
						"flex-1 rounded border",
						isDark
							? "border-slate-800 bg-slate-900"
							: "border-slate-100 bg-slate-50"
					)}
				/>
			</div>
		</div>
	);
}
