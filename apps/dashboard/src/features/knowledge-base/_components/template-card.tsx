import { Card } from "@zero-heads-lab/design-system/components/ui/card";
import { PlusIcon } from "lucide-react";

type TemplateCardProps = {
	title: string;
	description?: string;
	banner?: string;
};

export function TemplateCard({
	title,
	description,
	banner,
}: TemplateCardProps) {
	const image = banner ? banner : `https://picsum.photos/seed/${title}/720/720`;

	return (
		<Card className="relative mx-auto w-[180px] max-w-sm shrink-0 pt-0">
			<img
				alt={title}
				className="relative z-20 w-full object-cover"
				src={image}
			/>
			<p className="mt-2 text-center text-sm">{title}</p>
			<p className="mt-2 text-center text-muted-foreground text-xs">
				{description}
			</p>
		</Card>
	);
}

export function BlankTemplateCard() {
	return (
		<Card className="relative mx-auto w-[180px] max-w-sm shrink-0 pt-0">
			<div className="relative z-20 aspect-video h-full w-full bg-black/35">
				<PlusIcon className="absolute inset-0 m-auto h-12 w-12" />
			</div>
			<p className="mt-2 text-center text-sm">Blank</p>
			<p className="mt-2 text-center text-muted-foreground text-xs">
				Blank template
			</p>
		</Card>
	);
}

export default TemplateCard;
