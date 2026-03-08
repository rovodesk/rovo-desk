import { ArrowRight, BookOpen, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import heroImage from "../assets/blog-hero.jpg";

const container = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const statItems = [
    { icon: Zap, label: "AI Insights", value: "50+" },
    { icon: BookOpen, label: "Engineering Posts", value: "30+" },
    { icon: Users, label: "Monthly Readers", value: "12K" },
];

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden border-border border-b">
            {/* Background image with overlay */}
            <div className="absolute inset-0">
                <img
                    alt=""
                    className="h-full w-full object-cover opacity-20 dark:opacity-10"
                    src={heroImage}
                />
                <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/90 to-background" />
            </div>

            {/* Animated grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Floating accent orbs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
                transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/8 blur-3xl"
                transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
            />

            <div className="container relative mx-auto px-6 py-24 md:py-32 lg:py-36">
                <motion.div
                    animate="show"
                    className="max-w-3xl"
                    initial="hidden"
                    variants={container}
                >
                    <motion.div
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5"
                        variants={fadeUp}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium text-accent text-xs">
                            Insights from RovoDesk
                        </span>
                    </motion.div>

                    <motion.h1
                        className="mb-6 font-extrabold text-5xl text-foreground tracking-tight md:text-6xl lg:text-7xl"
                        variants={fadeUp}
                    >
                        Ideas that power{" "}
                        <span className="relative">
                            <span className="bg-linear-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                                intelligent
                            </span>
                            <motion.span
                                animate={{ scaleX: 1 }}
                                className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-accent/40"
                                initial={{ scaleX: 0 }}
                                style={{ originX: 0 }}
                                transition={{
                                    delay: 0.8,
                                    duration: 0.6,
                                    ease: [0.25, 0.4, 0.25, 1],
                                }}
                            />
                        </span>{" "}
                        support
                    </motion.h1>

                    <motion.p
                        className="mb-8 max-w-xl text-lg text-muted-foreground leading-relaxed md:text-xl"
                        variants={fadeUp}
                    >
                        Engineering deep dives, AI research, product updates, and the future
                        of customer experience — from the team building it.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap items-center gap-4"
                        variants={fadeUp}
                    >
                        <motion.a
                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground text-sm transition-shadow hover:shadow-accent/20 hover:shadow-lg"
                            href="#articles"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Browse Articles <ArrowRight className="h-4 w-4" />
                        </motion.a>
                        <motion.a
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-6 py-3 font-medium text-foreground text-sm backdrop-blur-sm transition-colors hover:bg-muted"
                            href="#newsletter"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Subscribe to Newsletter
                        </motion.a>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="mt-14 flex flex-wrap items-center gap-8 md:gap-12"
                        variants={fadeUp}
                    >
                        {statItems.map((stat) => (
                            <motion.div
                                className="flex items-center gap-3"
                                key={stat.label}
                                whileHover={{ y: -2 }}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                    <stat.icon className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="font-bold text-foreground text-lg">
                                        {stat.value}
                                    </p>
                                    <p className="text-muted-foreground text-xs">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
