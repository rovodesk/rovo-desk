import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { SmoothCursor } from "@/components/smooth-cursor";

import type {
	FeaturesBlock,
	HeroBlock,
	Page,
	ProblemBlock,
	Section,
} from "@/lib/componen-registry/types";

import { getHomePage } from "@/lib/utils/queries";
import HeroSection from "../blogs/hero";
import FeaturesSection from "./features";
import ProblemSection from "./problem";

/* -----------------------------
   Block Component Map
----------------------------- */

type SectionComponentMap = {
	hero: React.ComponentType<{
		data: HeroBlock;
		className?: string;
	}>;
	problem: React.ComponentType<{
		data: ProblemBlock;
		className?: string;
	}>;
	features: React.ComponentType<{
		data: FeaturesBlock;
		className?: string;
	}>;
};

type BlockType = keyof SectionComponentMap;

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
		className: "w-full pt-20 lg:pt-40",
	},
	features: {
		component: FeaturesSection,
		className: "w-full py-20",
	},
};

/* -----------------------------
   Renderer
----------------------------- */

const SectionRenderer = ({
	section,
	index,
}: {
	section: Section;
	index: number;
}) => {
	const key = section.id || `${section.blockType}-${index}`;

	switch (section.blockType) {
		case "hero": {
			const { component: Component, className } = blockRegistry.hero;
			return (
				<Component
					className={className}
					data={section as HeroBlock}
					key={key}
				/>
			);
		}

		case "problem": {
			const { component: Component, className } = blockRegistry.problem;
			return (
				<Component
					className={className}
					data={section as ProblemBlock}
					key={key}
				/>
			);
		}

		case "features": {
			const { component: Component, className } = blockRegistry.features;
			return (
				<Component
					className={className}
					data={section as FeaturesBlock}
					key={key}
				/>
			);
		}

		default:
			return null;
	}
};

/* -----------------------------
   Page
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

			<div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
				<main className="relative pb-20">
					{page.sections?.map((section, index) => (
						<SectionRenderer
							index={index}
							key={section.id || `${section.blockType}-${index}`}
							section={section}
						/>
					))}
				</main>
			</div>
		</>
	);
};

export default HomePage;
