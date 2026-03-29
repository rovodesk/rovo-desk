import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { LucideAlertCircle, type LucideIcon } from "lucide-react";
import type React from "react";

type SectionHeaderProps = {
	title: string;
	description: string;
	icon?: LucideIcon;
	image?: string;
	children?: React.ReactNode;
};

const SectionHeader = ({
	title,
	description,
	icon,
	image,
	children,
}: SectionHeaderProps) => {
	const Icon = icon || LucideAlertCircle;
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
						{image && <img alt={title} className="h-5 w-5" src={image} />}
						{icon && <Icon className="h-5 w-5 text-muted-foreground" />}
					</div>

					<div>
						<h1 className="font-semibold text-xl tracking-tight">{title}</h1>

						<p className="text-muted-foreground text-sm">{description}</p>
					</div>
				</div>

				{children}
			</div>

			<Separator className="h-px w-full bg-border" />
		</>
	);
};

export default SectionHeader;
