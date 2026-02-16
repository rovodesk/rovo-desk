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
	const image = banner || `https://picsum.photos/seed/${title}/200/280`;

	return (
		<div className="group flex w-[150px] shrink-0 cursor-pointer flex-col gap-2">
			<div className="relative aspect-3/4 overflow-hidden rounded-md border bg-muted shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-md">
				<img alt={title} className="h-full w-full object-cover" src={image} />
			</div>
			<div className="space-y-0.5">
				<p className="truncate font-medium text-xs">{title}</p>
				<p className="truncate text-[10px] text-muted-foreground">
					{description}
				</p>
			</div>
		</div>
	);
}

export function BlankTemplateCard() {
	return (
		<div className="group flex w-[150px] shrink-0 cursor-pointer flex-col gap-2">
			<div className="relative aspect-3/4 overflow-hidden rounded-md border border-dashed bg-background transition-all group-hover:border-primary group-hover:bg-primary/5">
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
					<div className="flex size-10 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/20">
						<PlusIcon className="h-6 w-6" />
					</div>
				</div>
			</div>
			<div className="space-y-0.5">
				<p className="font-medium text-xs">Blank</p>
				<p className="text-center text-[10px] text-muted-foreground sm:text-left">
					Start from scratch
				</p>
			</div>
		</div>
	);
}
