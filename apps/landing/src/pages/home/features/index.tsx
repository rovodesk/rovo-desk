import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type { FeaturesBlock } from "@/lib/componen-registry/types";
import BentoGrid from "./bento-grid";
import { PointerHighlight } from "./components/pointer-highlight";

type Props = {
	className?: string;
	data: FeaturesBlock;
};

export default function FeaturesSection({ className, data }: Props) {
	return (
		<section
			className={cn(
				"relative overflow-hidden bg-black",
				"px-4 py-20 sm:px-6 sm:py-28",
				className
			)}
		>
			{/* Background gradient fix */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black via-black/80 to-transparent" />

			<div className="relative mx-auto mb-20 max-w-7xl">
				<div
					className={cn(
						"flex flex-col items-center justify-center text-center",
						// 7xl sizing + Steel gradient effect
						"font-bold text-4xl tracking-tight sm:text-7xl",
						"bg-linear-to-b from-white via-white to-white/50 bg-clip-text text-transparent"
					)}
				>
					<span>The best way to grow is to</span>
					<PointerHighlight
						containerClassName="mt-2"
						pointerClassName="text-yellow-500"
						rectangleClassName="bg-neutral-800 border-neutral-300"
					>
						<span className="relative z-10 text-white">collaborate</span>
					</PointerHighlight>
				</div>
			</div>

			{/* Container */}
			<div className="relative mx-auto max-w-7xl">
				<BentoGrid />
			</div>
		</section>
	);
}
