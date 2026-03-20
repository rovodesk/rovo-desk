import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Spotlight } from "@/components/dual-spotlight";
import { GlobalBackground } from "@/components/global-background";
import { ShineBorder } from "@/components/shine-border";
import type { HeroBlock } from "@/lib/componen-registry/types";
import { CTA } from "../components/cta";
import { ShinnyBadge } from "../components/shinny-badge";

type Props = {
	data: HeroBlock;
	className?: string;
};

export default function ModernHeroSectionVariant({ data, className }: Props) {
	const productRef = useRef(null);

	const { scrollYProgress } = useScroll({
		target: productRef,
		offset: ["start end", "end start"],
	});

	const scale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
	const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
	const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

	return (
		<section
			className={cn(
				"relative flex min-h-svh flex-col overflow-hidden pt-32",
				className
			)}
		>
			{/* 1. SOLID BASE */}
			<div className="absolute inset-0 z-0 bg-black" />

			{/* 2. THE ACTUAL BACKGROUND IMAGE */}
			<div className="absolute inset-0 z-0 opacity-40">
				<img
					alt="Background Texture"
					className="h-full w-full object-cover opacity-40 mix-blend-screen" // Lower opacity so it doesn't fight the text
					src="/background.jpg"
				/>
				{/* DARK VIGNETTE */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at 50% 30%, transparent 0%, rgba(0,0,0,0.8) 70%, black 100%)",
					}}
				/>
			</div>

			{/* 3. TINTS AND GRADIENTS ON TOP OF IMAGE */}
			<GlobalBackground />

			{/* 4. CONTENT CONTAINER */}
			<div className="relative z-10 mx-auto max-w-7xl px-6 text-center lg:px-12">
				<div className="absolute inset-0 z-0">
					<Spotlight />
				</div>
				{/* TEXT SECTION */}
				<div className="mx-auto max-w-4xl">
					{/* Badge */}
					<ShinnyBadge />
					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className="bg-linear-to-b bg-opacity-50 from-neutral-50 to-neutral-400 bg-clip-text font-semibold text-5xl text-transparent tracking-tight lg:text-7xl"
						initial={{ opacity: 0, y: 30 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					>
						{data.headline.baseText}
					</motion.h1>

					<motion.p
						animate={{ opacity: 1, y: 0 }}
						className="mx-auto mt-6 max-w-xl text-lg text-neutral-300"
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.2, duration: 0.8 }}
					>
						Purpose-built for planning and building products. Designed for the
						AI era.
					</motion.p>
				</div>

				{/* CTA */}
				<div className="flex items-center justify-center">
					<CTA ctas={data.ctas || []} />
				</div>

				{/* 3. PRODUCT UI (The "Hero Image") */}
				<div className="w-full pt-12" ref={productRef}>
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="group/product relative mx-auto mt-10 max-w-[1000px] overflow-hidden rounded-t-2xl border-white/10 border-x border-t bg-[#0B0B0C] shadow-2xl"
						data-hide-cursor="true" // Custom attribute
						initial={{ opacity: 0, y: 40 }}
						style={{
							scale,
							y,
							opacity,
						}}
						transition={{ delay: 0.4, duration: 1 }}
					>
						<ShineBorder borderWidth={1.2} />
						<img
							alt="Product UI"
							className="h-auto w-full object-cover"
							src="/dashboards/chat.png"
						/>
						{/* Subtle inner shadow/gradient to blend the bottom */}
						<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#080809] via-transparent to-transparent" />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
