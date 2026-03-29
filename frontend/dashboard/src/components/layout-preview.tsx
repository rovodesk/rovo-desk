export function LayoutPreview({
	type,
}: {
	type: "sidebar" | "inset" | "floating";
}) {
	return (
		<div className="flex h-10 w-12 items-center justify-center rounded-md border border-muted-foreground/20 bg-muted/50">
			{type === "sidebar" && (
				<div className="flex h-full w-full gap-1 p-1">
					<div className="w-1/3 rounded-sm bg-primary/40" />
					<div className="flex-1 rounded-sm bg-primary/10" />
				</div>
			)}
			{type === "inset" && (
				<div className="h-full w-full p-1">
					<div className="h-full w-full rounded-sm border-2 border-primary/40 bg-primary/10" />
				</div>
			)}
			{type === "floating" && (
				<div className="h-full w-full p-2">
					<div className="h-full w-full rounded-full bg-primary/40 shadow-md" />
				</div>
			)}
		</div>
	);
}
