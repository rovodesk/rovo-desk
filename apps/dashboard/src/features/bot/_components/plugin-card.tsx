import {
	Card,
	CardContent,
} from "@zero-heads-lab/design-system/components/ui/card";

export function PluginCard({
	icon,
	label,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	onClick: () => void;
}) {
	return (
		<Card
			className="group cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-md"
			onClick={onClick}
		>
			<CardContent className="flex flex-col items-center justify-center gap-3 p-6">
				<div className="transition-transform duration-300 group-hover:scale-110">
					{icon}
				</div>
				<span className="font-medium text-sm">{label}</span>
			</CardContent>
		</Card>
	);
}
