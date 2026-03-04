export function SectionHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="mb-6">
			<h2 className="font-semibold text-lg">{title}</h2>
			<p className="mt-1 text-muted-foreground text-sm">{description}</p>
		</div>
	);
}
