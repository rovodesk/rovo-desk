import { useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { Header } from "@/components/header";
import { SmoothCursor } from "@/components/smooth-cursor";
import type {
=======
import type {
	ComingSoonBlock,
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
	FeaturesBlock,
	HeroBlock,
	Page,
	ProblemBlock,
	Section,
} from "@/lib/componen-registry/types";
import { getHomePage } from "@/lib/utils/queries";
<<<<<<< HEAD
import FeaturesSection from "./features";
import { HeroSection } from "./hero";
=======

import ComingSoonSection from "./coming-soon";
import FeaturesSection from "./features";
import Header from "./header";
import HeroSection from "./hero";
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
import ProblemSection from "./problem";
import WaitlistSection from "./waitlist";

/* -----------------------------
   Block Component Map
----------------------------- */

type SectionComponentMap = {
	hero: React.ComponentType<{ data: HeroBlock }>;
	problem: React.ComponentType<{ data: ProblemBlock }>;
	features: React.ComponentType<{ data: FeaturesBlock }>;
	comingSoon: React.ComponentType<{ data: ComingSoonBlock }>;
};

const blocks: SectionComponentMap = {
	hero: HeroSection,
	problem: ProblemSection,
	features: FeaturesSection,
	comingSoon: ComingSoonSection,
};

export type BlockType = keyof SectionComponentMap &
	React.ComponentType<HTMLDivElement>;

/* -----------------------------
   Renderer
----------------------------- */

const renderSection = (section: Section) => {
	const Component = blocks[section.blockType];

	if (!Component) return null;

<<<<<<< HEAD
type SectionComponentMap = {
	hero: React.ComponentType<{ data: HeroBlock; className?: string }>;
	problem: React.ComponentType<{ data: ProblemBlock; className?: string }>;
	features: React.ComponentType<{ data: FeaturesBlock; className?: string }>;
};

export type BlockType = keyof SectionComponentMap;

const blockRegistry: {
	[K in BlockType]: {
		component: SectionComponentMap[K];
		className: string;
	};
} = {
	hero: {
		component: HeroSection,
		className: "w-full",
	},
	problem: {
		component: ProblemSection,
		className: "w-full py-20",
	},
	features: {
		component: FeaturesSection,
		className: "w-full py-20",
	},
} as const;

const SectionRenderer = ({
	section,
	index,
}: {
	section: Section;
	index: number;
}) => {
	const key = section.id || `${section.blockType}-${index}`;

	const block = blockRegistry[section.blockType];
	if (!block) return null;

	const Component = block.component as React.ComponentType<{
		data: Section;
		className?: string;
	}>;
	return <Component className={block.className} data={section} key={key} />;
};

=======
	switch (section.blockType) {
		case "hero":
			return (
				<Component
					className="w-full"
					data={section as HeroBlock}
					key={section.id}
				/>
			);
		case "problem":
			return (
				// <Component
				// 	className="w-full pt-20 lg:pt-40"
				// 	data={section as ProblemBlock}
				// 	key={section.id}
				// />
				<WaitlistSection />
			);
		case "features":
			return (
				<Component
					className="w-full py-20"
					data={section as FeaturesBlock}
					key={section.id}
				/>
			);
		// case "comingSoon":
		// 	return (
		// 		<Component
		// 			className="w-full"
		// 			data={section as ComingSoonBlock}
		// 			key={section.id}
		// 		/>
		// 	);
		default:
			return null;
	}
};

>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
/* -----------------------------
   Home Page
----------------------------- */

const HomePage = () => {
	const {
		data: page,
		isLoading,
		error,
	} = useQuery<Page>({
		queryKey: ["pages", "home"],
		queryFn: getHomePage,
	});

	if (isLoading) return <div>Loading...</div>;
	if (error || !page) return <div>Failed to load page</div>;

	return (
		<>
			<SmoothCursor />
			<Header />

<<<<<<< HEAD
			<div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
				<main className="relative pb-20">
					{page.sections?.map((section, index) => (
						<SectionRenderer index={index} key={section.id} section={section} />
					))}
				</main>
			</div>
=======
			<main className="relative min-h-screen w-full overflow-hidden pb-40">
				{page.sections?.map(renderSection)}
			</main>
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
		</>
	);
};

export default HomePage;
