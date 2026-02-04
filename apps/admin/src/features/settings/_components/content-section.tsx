import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { TabsContent } from "@zero-heads-lab/design-system/components/ui/tabs";

interface ContentSectionProps {
	title: string;
	desc: string;
	children: React.JSX.Element;
}

export function ContentSection({ title, desc, children }: ContentSectionProps) {
	return (
		<div className="flex flex-1 flex-col">
			<div className="flex-none">
				<h3 className="font-semibold text-xl">{title}</h3>
				<p className="text-base text-muted-foreground">{desc}</p>
			</div>

			<Separator className="my-4 flex-none" />

			<div className="faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12">
				<TabsContent className="-mx-1 px-1.5" value={title}>
					{children}
				</TabsContent>
			</div>
		</div>
	);
}
