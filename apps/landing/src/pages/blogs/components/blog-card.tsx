import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { BlogPost } from "../data";
import { AuthorAvatar } from "./author-avatar";
import { CategoryBadge } from "./category-badge";

interface BlogCardProps {
	post: BlogPost;
	index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 24 }}
			transition={{
				duration: 0.45,
				delay: index * 0.08,
				ease: [0.25, 0.4, 0.25, 1],
			}}
			viewport={{ once: true, margin: "-40px" }}
			whileInView={{ opacity: 1, y: 0 }}
		>
			<Link
				className="group block h-full"
				params={{
					slug: post.slug,
				}}
				to="/blogs/post/$slug"
			>
				<motion.div
					className="h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-accent/5 hover:shadow-xl"
					transition={{ duration: 0.25, ease: "easeOut" }}
					whileHover={{ y: -4 }}
				>
					<div className="aspect-video overflow-hidden">
						<motion.img
							alt={post.title}
							className="h-full w-full object-cover"
							loading="lazy"
							src={post.coverImage}
							transition={{ duration: 0.6, ease: "easeOut" }}
							whileHover={{ scale: 1.06 }}
						/>
					</div>
					<div className="p-6">
						<div className="mb-3 flex items-center gap-3">
							<CategoryBadge category={post.category} />
							<span className="text-muted-foreground text-xs">
								{post.readingTime} min read
							</span>
						</div>
						<h3 className="mb-2 font-semibold text-foreground text-lg leading-snug transition-colors duration-200 group-hover:text-accent">
							{post.title}
						</h3>
						<p className="mb-4 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
							{post.excerpt}
						</p>
						<div className="flex items-center gap-3">
							<AuthorAvatar author={post.author} size="sm" />
							<div className="flex flex-col">
								<span className="font-medium text-foreground text-sm">
									{post.author.name}
								</span>
								<span className="text-muted-foreground text-xs">
									{new Date(post.publishedAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</div>
						</div>
					</div>
				</motion.div>
			</Link>
		</motion.article>
	);
}
