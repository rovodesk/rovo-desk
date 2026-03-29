export function SectionHeader({
	title,
	description,
	children,
}: {
	title?: string;
	description?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="mb-6 flex items-center justify-between">
			<div>
				{title && <h2 className="font-semibold text-lg">{title}</h2>}
				{description && (
					<p className="mt-1 text-muted-foreground text-sm">{description}</p>
				)}
			</div>
			{children}
		</div>
	);
}
