import { Card } from "@zero-heads-lab/design-system/components/ui/card";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { FileText, Star } from "lucide-react";

type DocCardProps = {
	id: string;
	banner?: string;
	title: string;
	createdAt?: string | Date;
	variant?: "list" | "card";
	isFavourite?: boolean;
	className?: string;
};
export function DocCard({
	banner,
	title,
	createdAt,
	variant = "card",
	isFavourite,
	className,
}: DocCardProps) {
	const image = banner || `https://picsum.photos/seed/${title}/400/250`;

	if (variant === "list") {
		return (
			<div
				className={cn(
					"group flex items-center justify-between rounded-md border bg-background px-4 py-2 transition-all hover:border-primary/50",
					className
				)}
			>
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded bg-muted text-muted-foreground">
						<FileText size={16} />
					</div>
					<h3 className="font-medium text-xs leading-none">{title}</h3>
				</div>
				<Star
					className={cn(
						"text-muted-foreground/50",
						isFavourite && "fill-yellow-500 text-yellow-500"
					)}
					size={14}
				/>
			</div>
		);
	}

	return (
		<Card
			className={cn(
				"group overflow-hidden border-muted py-0 shadow-none transition-all hover:border-primary/40 hover:shadow-sm",
				className
			)}
		>
			{/* Aspect changed to be shorter (16:10 ratio) */}
			<div className="relative aspect-16/10 w-full overflow-hidden bg-muted/50">
				<img
					alt={title}
					className="h-full w-full object-cover grayscale-[0.2] transition-transform group-hover:scale-105 group-hover:grayscale-0"
					src={image}
				/>
			</div>
			<div className="flex justify-between p-2.5">
				<div>
					<h3 className="truncate font-medium text-xs tracking-tight">
						{title}
					</h3>
					<p className="mt-1 text-[10px] text-muted-foreground italic">
						{createdAt instanceof Date
							? createdAt.toLocaleDateString()
							: "Just now"}
					</p>
				</div>
				<Star
					className={cn(
						"text-muted-foreground/50",
						isFavourite && "fill-yellow-500 text-yellow-500"
					)}
					size={14}
				/>
			</div>
		</Card>
	);
}
