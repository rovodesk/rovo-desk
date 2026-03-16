import { useQuery } from "@tanstack/react-query";
import type {
	ComingSoonBlock,
	FeaturesBlock,
	HeroBlock,
	Page,
	ProblemBlock,
	Section,
} from "@/lib/componen-registry/types";
import { getHomePage } from "@/lib/utils/queries";

import ComingSoonSection from "./coming-soon";
import FeaturesSection from "./features";
import Header from "./header";
import HeroSection from "./hero";
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
			<Header />

			<main className="relative min-h-screen w-full overflow-hidden pb-40">
				{page.sections?.map(renderSection)}
			</main>
		</>
	);
};

export default HomePage;
