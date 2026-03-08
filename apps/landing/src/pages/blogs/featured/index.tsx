import { motion } from "motion/react";
import { resolveImage } from "@/utils/resolve-image";
import { getFeaturedPost } from "../data";
import { FeaturedPost } from "./featured-post";

export const FeaturedSection = () => {
    const featuredPost = getFeaturedPost();

    return (
        <section className="border-border border-b">
            <div className="container mx-auto px-6 py-14">
                <motion.p
                    className="mb-6 font-semibold text-muted-foreground text-xs uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1 }}
                >
                    Featured Article
                </motion.p>
                {featuredPost && (
                    <FeaturedPost
                        post={{
                            ...featuredPost,
                            coverImage: resolveImage(featuredPost.coverImage),
                        }}
                    />
                )}
            </div>
        </section>
    );
};
