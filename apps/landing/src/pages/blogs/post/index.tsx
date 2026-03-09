import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { resolveImage } from "@/lib/utils/resolve-image";
import { AuthorAvatar } from "../components/author-avatar";
import { BlogCard } from "../components/blog-card";
import { CategoryBadge } from "../components/category-badge";
import { NewsletterCTA } from "../components/newsletter-cta";
import { PostFeedback } from "../components/post-feedback";
import { ReadingProgressBar } from "../components/reading-progress-bar";
import { ShareButtons } from "../components/share-buttons";
import { TableOfContents } from "../components/table-of-contents";
import { getPostBySlug, getRelatedPosts } from "../data";

const BlogPost = ({ slug }: { slug: string }) => {
	const post = slug ? getPostBySlug(slug) : undefined;

	if (!post) {
		return (
			<main className="relative min-h-screen w-full overflow-hidden">
				<div className="container mx-auto px-6 py-20 text-center">
					<h1 className="mb-4 font-bold text-2xl text-foreground">
						Post not found
					</h1>
					<Link className="text-accent hover:underline" to="/">
						← Back to blog
					</Link>
				</div>
			</main>
		);
	}

	const relatedPosts = getRelatedPosts(post.slug);
	const publishDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<main className="relative min-h-screen w-full overflow-hidden">
			<ReadingProgressBar />

			{/* Hero */}
			<section className="border-border border-b">
				<div className="container mx-auto px-6 py-12 md:py-16">
					<Link
						className="mb-8 inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
						to="/"
					>
						<ArrowLeft className="h-4 w-4" /> Back to blog
					</Link>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="max-w-3xl"
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.5 }}
					>
						<div className="mb-4 flex items-center gap-3">
							<CategoryBadge category={post.category} />
							<span className="text-muted-foreground text-sm">
								{post.readingTime} min read
							</span>
						</div>
						<h1 className="mb-6 font-bold text-3xl text-foreground leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
							{post.title}
						</h1>
						<div className="flex items-center gap-4">
							<AuthorAvatar author={post.author} size="lg" />
							<div>
								<p className="font-medium text-foreground">
									{post.author.name}
								</p>
								<p className="text-muted-foreground text-sm">
									{post.author.role} · {publishDate}
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Cover Image */}
			<div className="container mx-auto px-6">
				<motion.div
					animate={{ opacity: 1, scale: 1 }}
					className="my-8 overflow-hidden rounded-xl"
					initial={{ opacity: 0, scale: 0.98 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<img
						alt={post.title}
						className="w-full object-cover"
						src={resolveImage(post.coverImage)}
						style={{ maxHeight: 480 }}
					/>
				</motion.div>
			</div>

			{/* Content + TOC */}
			<div className="container mx-auto px-6 py-8">
				<div className="grid gap-12 lg:grid-cols-[1fr_240px]">
					<motion.article
						animate={{ opacity: 1 }}
						className="prose-blog max-w-none"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Post content
						dangerouslySetInnerHTML={{ __html: post.content }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					/>

					<aside className="hidden lg:block">
						<div className="sticky top-24">
							<TableOfContents content={post.content} />
							<div className="mt-8 border-border border-t pt-6">
								<ShareButtons slug={post.slug} title={post.title} />
							</div>
						</div>
					</aside>
				</div>
			</div>

			{/* Feedback */}
			<div className="container mx-auto max-w-3xl px-6">
				<PostFeedback />
			</div>

			{/* Share (mobile) */}
			<div className="container mx-auto px-6 pb-8 lg:hidden">
				<div className="border-border border-t pt-6">
					<ShareButtons slug={post.slug} title={post.title} />
				</div>
			</div>

			{/* Related */}
			{relatedPosts.length > 0 && (
				<section className="border-border border-t">
					<div className="container mx-auto px-6 py-16">
						<h2 className="mb-8 font-bold text-2xl text-foreground">
							Related Articles
						</h2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{relatedPosts.map((p, i) => (
								<BlogCard
									index={i}
									key={p.id}
									post={{ ...p, coverImage: resolveImage(p.coverImage) }}
								/>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Newsletter */}
			<section className="container mx-auto px-6 pb-16">
				<NewsletterCTA />
			</section>
		</main>
	);
};

export default BlogPost;
