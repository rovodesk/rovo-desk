import FeaturesSection from "./features";
import HeroSection from "./hero";
import { PricingSection } from "./pricing";
import ProblemSection from "./problem";

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
