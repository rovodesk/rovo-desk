export function SDKCard({
	title,
	description,
	icon,
	active,
	onClick,
}: {
	title: string;
	description: string;
	icon: React.ReactNode;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			className={`flex flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:shadow-lg ${
				active
					? "border-primary shadow-md ring-2 ring-primary/5"
					: "border-accent shadow-sm hover:border-primary/40"
			}`}
			onClick={onClick}
		>
			<div className="mb-4 w-fit rounded-xl p-3">{icon}</div>
			<h3 className="mb-1 font-bold text-lg">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{description}
			</p>
		</button>
	);
}
