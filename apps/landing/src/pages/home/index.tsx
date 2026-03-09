import { useQuery } from "@tanstack/react-query";
import { getHomePage } from "@/lib/utils/queries";
import ComingSoonSection from "./coming-soon";
import FeaturesSection from "./features";
import Header from "./header";
import HeroSection from "./hero";
// import { PricingSection } from "./pricing";
import ProblemSection from "./problem";

// biome-ignore lint/suspicious/noExplicitAny: Accepts object
const renderSection = (section: Record<string, any>) => {
	switch (section.blockType) {
		case "hero":
			return <HeroSection data={section} key={section.id} />;

		case "problem":
			return <ProblemSection data={section} key={section.id} />;

		case "features":
			return <FeaturesSection data={section} key={section.id} />;

		case "comingSoon":
			return <ComingSoonSection data={section} key={section.id} />;

		default:
			return null;
	}
};

const HomePage = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["pages", "home"],
		queryFn: getHomePage,
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Failed to load page</div>;

	const page = data;

	return (
		<>
			<Header />
			<main className="relative min-h-screen w-full overflow-hidden">
				{page.sections?.map(renderSection)}
			</main>
		</>
	);
};

export default HomePage;
