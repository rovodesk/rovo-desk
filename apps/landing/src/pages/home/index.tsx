import ComingSoonSection from "./coming-soon";
import FeaturesSection from "./features";
import Header from "./header";
import HeroSection from "./hero";
// import { PricingSection } from "./pricing";
import ProblemSection from "./problem";

const HomePage = () => {
	return (
		<>
			<Header />
			<main className="relative min-h-screen w-full overflow-hidden">
				{/* Hero Section */}
				<HeroSection />
				{/* Problem Section */}
				<ProblemSection />
				{/* Feature Showcase */}
				<FeaturesSection />
				{/* Pricing */}
				{/* <PricingSection /> */}
				{/* Coming Soon */}
				<ComingSoonSection />
			</main>
		</>
	);
};

export default HomePage;
