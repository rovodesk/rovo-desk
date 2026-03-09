import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";
import { env } from "@/env";
import { AvatarGroup } from "./avatar-group";
import { ChatSequence } from "./chat-sequence";

type HeroSectionProps = {
	// biome-ignore lint/suspicious/noExplicitAny: Accepts data as object
	data: Record<string, any>;
} & React.ComponentProps<"section">;

export default function HeroSection(props: HeroSectionProps) {
	const imageUrl = `${env.PUBLIC_API_URL}/${props.data.background.image.url}`;

	return (
		<section
			className="relative z-10 mx-auto grid w-full grid-cols-1 items-start bg-slate-900 px-4 pt-20 pb-16 sm:px-6 md:h-140 md:pt-24 lg:min-h-svh lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8"
			{...props}
		>
			<Background
				altText={props.data.background.image.alt}
				imageUrl={imageUrl}
			/>
			{/* Left Column: Typography & CTAs */}
			<LeftColumn
				ctas={props.data.ctas}
				headline={props.data.headline}
				subHeadline={props.data.subHeadline}
			/>
			{/* Right Column: Animated Chat Widget */}
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
};

const LeftColumn = ({
	headline,
	subHeadline,
	ctas,
}: {
	headline: {
		prefixText: string;
		highlightText: string;
		baseText: string;
		accentText: string;
	};
	subHeadline: {
		text: string;
		enabled: boolean;
	};
	ctas: {
		label: string;
		link: string;
		id?: string;
	}[];
}) => {
	const [scope, animate] = useAnimate();
	const wordsArray = subHeadline.text.split(" ");

	useEffect(() => {
		animate(
			"span",
			{
				opacity: 1,
				filter: "blur(0px)",
			},
			{
				duration: 1,
				delay: stagger(0.2),
			}
		);
	}, [animate]);

	return (
		<div className="z-10 flex w-full max-w-3xl flex-col justify-center px-4 sm:px-6 lg:px-0">
			{/* Launch badge */}
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-blue-300 text-xs backdrop-blur-sm sm:text-sm"
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
			>
				<span className="flex size-2 animate-pulse rounded-full bg-blue-500" />
				Launching Soon
			</motion.div>

			{/* Heading */}
			<motion.h1
				animate={{ opacity: 1, y: 0 }}
				className="font-extrabold text-3xl text-white tracking-tight sm:text-4xl md:text-5xl lg:text-7xl lg:leading-[1.2]"
				initial={{ opacity: 0, y: 30 }}
				transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
			>
				{headline.prefixText}{" "}
				{headline.highlightText && (
					<>
						<span className="relative inline-block">
							<span className="relative z-10 px-1">
								{headline.highlightText}
							</span>
							{/* underline */}
							<svg
								className="absolute -bottom-4 left-0 h-7.5 w-[130%] -translate-x-[5%] sm:-bottom-6 sm:h-11.5 sm:w-[150%]"
								preserveAspectRatio="none"
								viewBox="0 0 400 32"
							>
								<motion.path
									animate={{ pathLength: 1, opacity: 1 }}
									className="text-blue-600"
									d="M5 15 Q80 8 150 14 T295 13"
									fill="transparent"
									initial={{ pathLength: 0, opacity: 0 }}
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="8"
									transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
								/>
							</svg>
						</span>
						<br />
					</>
				)}
				{headline.baseText}{" "}
				{headline.accentText && (
					<motion.span
						animate={{ opacity: 1, y: 0 }}
						className="text-blue-600"
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
					>
						{headline.accentText}
					</motion.span>
				)}
			</motion.h1>

			{/* Subtitle */}
			{subHeadline.enabled && (
				<div
					className="mt-6 max-w-md font-medium text-base text-gray-400 leading-relaxed sm:mt-2 sm:max-w-xl sm:text-lg"
					ref={scope}
				>
					{wordsArray.map((word, idx) => (
						<motion.span
							className="subtitle-word inline-block translate-y-2 opacity-0"
							key={word + idx}
							style={{ filter: "blur(8px)" }}
						>
							{word}&nbsp;
						</motion.span>
					))}
				</div>
			)}

			{/* Buttons */}
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="mt-8 flex w-full flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-6"
				initial={{ opacity: 0, y: 20 }}
				transition={{ duration: 0.5, delay: 0.6 }}
			>
				{ctas.map((cta, idx) => (
					<button
						className="group flex items-center gap-2 font-semibold text-white transition-colors hover:text-blue-400"
						key={cta.id || idx}
					>
						{cta.label}
					</button>
				))}
				<AvatarGroup />
			</motion.div>
		</div>
	);
};

const RightColumn = () => {
	return (
		<div className="relative hidden w-full items-center justify-center lg:flex">
			<motion.div
				animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0, y: 0 }}
				className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem]"
				initial={{ opacity: 0, scale: 0.8, x: 50, rotateY: 40, y: 15 }}
				style={{ perspective: "1200px" }}
				transition={{
					type: "spring",
					stiffness: 100,
					damping: 20,
					delay: 0.4,
				}}
			>
				<ChatSequence className="mask-[linear-gradient(to_top,transparent,black_20%,black)]" />
			</motion.div>
		</div>
	);
};
