<<<<<<< HEAD
import type { HeroBlock } from "@/lib/componen-registry/types";
import ModernHeroSectionVariant from "./variants/modern";

type Props = {
	data: HeroBlock;
	className?: string;
=======
import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";
import type { HeroBlock } from "@/lib/componen-registry/types";
import { AvatarGroup } from "./avatar-group";
import { ChatSequence } from "./chat-sequence";

type HeroSectionProps = {
	data: HeroBlock;
};

export default function HeroSection({ data }: HeroSectionProps) {
	// const imageUrl = `${env.PUBLIC_API_URL}/${data.background.image.url}`;
	const imageUrl = "/background.jpg";

	return (
		<section
			className="relative z-10 mx-auto grid w-full grid-cols-1 items-start bg-slate-900 px-4 pt-20 pb-16 sm:px-6 md:h-140 md:pt-24 lg:min-h-svh lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8"
			style={{
				clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
			}}
		>
			<Background altText={data.background.image.alt} imageUrl={imageUrl} />

			<LeftColumn
				ctas={data.ctas ?? []}
				headline={data.headline}
				subHeadline={data.subHeadline ?? { text: "", enabled: false }}
			/>

			<RightColumn />
		</section>
	);
}

const Background = ({
	imageUrl,
	altText,
}: {
	imageUrl: string;
	altText: string;
}) => {
	console.log("IMAGE", imageUrl);
	return (
		<div className="absolute inset-0 z-0">
			<img
				alt={altText}
				className="h-full w-full object-cover opacity-60"
				src={imageUrl} // Adjust opacity for "dark backdrop" effect
			/>
			{/* SIDE FADE: Keeps text readable on the left */}
			<div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/20 to-transparent" />
			{/* BOTTOM FADE: The "Melting" effect into the next section */}
			<div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
			{/* OPTIONAL: Dark Overlay */}
			<div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
		</div>
	);
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
};

export const HeroSection = ({ data, className }: Props) => {
	return <ModernHeroSectionVariant className={className} data={data} />;
};
