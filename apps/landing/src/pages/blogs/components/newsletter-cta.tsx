import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function NewsletterCTA() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail("");
        }
    };

    return (
        <motion.section
            className="rounded-xl border border-border bg-card p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
        >
            <div className="mx-auto max-w-lg text-center">
                <h3 className="mb-2 font-bold text-2xl text-foreground">
                    Stay in the loop
                </h3>
                <p className="mb-6 text-muted-foreground">
                    Get the latest on AI-powered customer support, product updates, and
                    engineering insights.
                </p>
                {submitted ? (
                    <p className="font-medium text-accent text-sm">
                        Thanks for subscribing! 🎉
                    </p>
                ) : (
                    <form className="flex gap-2" onSubmit={handleSubmit}>
                        <input
                            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            required
                            type="email"
                            value={email}
                        />
                        <button
                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground text-sm transition-opacity hover:opacity-90"
                            type="submit"
                        >
                            Subscribe <ArrowRight className="h-4 w-4" />
                        </button>
                    </form>
                )}
            </div>
        </motion.section>
    );
}
