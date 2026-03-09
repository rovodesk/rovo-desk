import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { resolveImage } from "@/utils/resolve-image";
import { BlogCard } from "../components/blog-card";
import { CategoryBadge } from "../components/category-badge";
import { blogPosts, type Category, categories } from "../data";

const PostsGallery = () => {
	const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
	const [search, setSearch] = useState("");
	const [searchFocused, setSearchFocused] = useState(false);

	const filteredPosts = useMemo(() => {
		let posts = blogPosts.filter((p) => !p.featured);
		if (activeCategory !== "All") {
			posts = posts.filter((p) => p.category === activeCategory);
		}
		if (search) {
			const q = search.toLowerCase();
			posts = posts.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.excerpt.toLowerCase().includes(q) ||
					p.tags.some((t) => t.toLowerCase().includes(q))
			);
		}
		return posts;
	}, [activeCategory, search]);

	return (
		<section className="container mx-auto px-6 py-14" id="articles">
			<motion.div
				className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
				initial={{ opacity: 0, y: 16 }}
				transition={{ duration: 0.4 }}
				viewport={{ once: true }}
				whileInView={{ opacity: 1, y: 0 }}
			>
				{/* Categories */}
				<div className="flex flex-wrap items-center gap-2">
					<motion.button
						className={`inline-flex items-center rounded-full px-4 py-1.5 font-semibold text-xs transition-all duration-200 ${activeCategory === "All"
							? "bg-blue-600 shadow-blue-600/20 shadow-sm"
							: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
						onClick={() => setActiveCategory("All")}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						All
					</motion.button>
					{categories.map((cat) => (
						<motion.div
							key={cat}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<CategoryBadge
								active={activeCategory === cat}
								category={cat}
								interactive
								onClick={() => setActiveCategory(cat)}
							/>
						</motion.div>
					))}
				</div>

				{/* Search */}
				<motion.div
					className={`relative transition-all duration-300 ${searchFocused ? "max-w-xl" : "max-w-sm"} w-full rounded-lg`}
				>
					<Search
						className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? "text-blue-600" : "text-muted-foreground"}`}
					/>
					<input
						className="w-full rounded-lg border border-input bg-background py-2.5 pr-4 pl-9 text-foreground text-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
						onBlur={() => setSearchFocused(false)}
						onChange={(e) => setSearch(e.target.value)}
						onFocus={() => setSearchFocused(true)}
						placeholder="Search articles..."
						type="text"
						value={search}
					/>
				</motion.div>
			</motion.div>

			{/* Grid */}
			<AnimatePresence mode="wait">
				{filteredPosts.length > 0 ? (
					<motion.div
						animate={{ opacity: 1 }}
						className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						key={activeCategory + search}
						transition={{ duration: 0.3 }}
					>
						{filteredPosts.map((post, i) => (
							<BlogCard
								index={i}
								key={post.id}
								post={{ ...post, coverImage: resolveImage(post.coverImage) }}
							/>
						))}
					</motion.div>
				) : (
					<motion.div
						animate={{ opacity: 1 }}
						className="py-24 text-center"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						key="empty"
					>
						<p className="text-muted-foreground">No articles found.</p>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
};

export default PostsGallery;
