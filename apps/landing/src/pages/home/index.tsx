import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SmoothCursor } from "@/components/smooth-cursor";
import type {
	FeaturesBlock,
	HeroBlock,
	Page,
	ProblemBlock,
	Section,
} from "@/lib/componen-registry/types";
import { getHomePage } from "@/lib/utils/queries";
import FeaturesSection from "./features";
import { HeroSection } from "./hero";
import ProblemSection from "./problem";

/* -----------------------------
   Block Component Map
----------------------------- */

export type BlockType = keyof SectionComponentMap &
	React.ComponentType<HTMLDivElement>;

/* -----------------------------
   Renderer
----------------------------- */

type SectionComponentMap = {
	hero: React.ComponentType<{ data: HeroBlock; className?: string }>;
	problem: React.ComponentType<{ data: ProblemBlock; className?: string }>;
	features: React.ComponentType<{ data: FeaturesBlock; className?: string }>;
};

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

			<div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
				<main className="relative pb-20">
					{page.sections?.map((section, index) => (
						<SectionRenderer index={index} key={section.id} section={section} />
					))}
				</main>
			</div>
		</>
	);
};

export default HomePage;
