import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { AuthorAvatar } from "../components/author-avatar";
import { CategoryBadge } from "../components/category-badge";
import type { BlogPost } from "../data";

export const FeaturedPost = ({ post }: { post: BlogPost }) => {
	return (
		<motion.article
			initial={{ opacity: 0, y: 30 }}
			transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
			viewport={{ once: true }}
			whileInView={{ opacity: 1, y: 0 }}
		>
			<Link
				className="group block"
				params={{
					slug: post.slug,
				}}
				to="/blogs/post/$slug"
			>
				<motion.div
					className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 md:grid md:grid-cols-2 md:gap-0"
					transition={{ duration: 0.3, ease: "easeOut" }}
					whileHover={{ y: -3 }}
				>
					<div className="aspect-video overflow-hidden md:aspect-auto md:h-full">
						<motion.img
							alt={post.title}
							className="h-full w-full object-cover"
							src={post.coverImage}
							transition={{ duration: 0.7, ease: "easeOut" }}
							whileHover={{ scale: 1.05 }}
						/>
					</div>
					<div className="flex flex-col justify-center p-8 md:p-12">
						<div className="mb-4 flex items-center gap-3">
							<motion.span
								className="font-medium text-blue-600 text-xs uppercase tracking-widest"
								initial={{ opacity: 0, x: -10 }}
								transition={{ delay: 0.3 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, x: 0 }}
							>
								Featured
							</motion.span>
							<span className="text-muted-foreground">·</span>
							<CategoryBadge category={post.category} />
						</div>
						<h2 className="mb-4 font-bold text-2xl text-foreground leading-tight transition-colors duration-200 group-hover:text-blue-600 md:text-3xl">
							{post.title}
						</h2>
						<p className="mb-6 text-muted-foreground leading-relaxed">
							{post.excerpt}
						</p>
						<div className="mb-6 flex items-center gap-3">
							<AuthorAvatar author={post.author} size="md" />
							<div>
								<p className="font-medium text-foreground text-sm">
									{post.author.name}
								</p>
								<p className="text-muted-foreground text-xs">
									{new Date(post.publishedAt).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
									{" · "}
									{post.readingTime} min read
								</p>
							</div>
						</div>
						<motion.span
							className="inline-flex items-center gap-1.5 font-medium text-blue-600 text-sm"
							transition={{ duration: 0.2 }}
							whileHover={{ x: 4 }}
						>
							Read article <ArrowRight className="h-4 w-4" />
						</motion.span>
					</div>
				</motion.div>
			</Link>
		</motion.article>
	);
};
