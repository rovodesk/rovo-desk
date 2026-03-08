import FeaturesSection from "./sections/features";
import HeroSection from "./sections/hero";
import { PricingSection } from "./sections/pricing";
import ProblemSection from "./sections/problem";

const HomePage = () => {
	return (
		<main className="relative min-h-screen w-full overflow-hidden">
			{/* Hero Section */}
			<HeroSection />
			{/* Problem Section */}
			<ProblemSection />
			{/* Feature Showcase */}
			<FeaturesSection />
			{/* Pricing */}
			<PricingSection />
		</main>
	);
};

export default HomePage;
