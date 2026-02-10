import { Card } from "@zero-heads-lab/design-system/components/ui/card";

type DocCardProps = {
	banner?: string;
	title: string;
};

export function DocCard({ banner, title }: DocCardProps) {
	const image = banner ? banner : `https://picsum.photos/seed/${title}/720/720`;

	return (
		<Card className="relative mx-auto w-[270px] max-w-sm shrink-0 pt-0">
			<img
				alt={title}
				className="relative z-20 w-full object-cover"
				src={image}
			/>
			<p className="mt-2 text-center text-sm">{title}</p>
			<p className="mt-2 text-center text-muted-foreground text-xs">
				Open Recently
			</p>
		</Card>
	);
}

export default DocCard;
