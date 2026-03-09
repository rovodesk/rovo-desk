import { FeaturedSection } from "./featured";
import PostsGallery from "./gallery";
import { Header } from "./header";
import HeroSection from "./hero";

const BlogsPage = () => {
	return (
		<>
			<Header />
			<main className="relative min-h-screen w-full overflow-hidden">
				{/* Hero Section */}
				<HeroSection />
				{/* Featured Blogs */}
				<FeaturedSection />
				{/* Blogs Section */}
				<PostsGallery />
				{/* NewsLetters */}
				{/* <NewsletterCTA /> */}
			</main>
		</>
	);
};

export default BlogsPage;
