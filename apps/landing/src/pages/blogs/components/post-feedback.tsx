import {
	Heart,
	MessageSquare,
	Send,
	Sparkles,
	ThumbsDown,
	ThumbsUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Reaction = "helpful" | "not-helpful" | null;

export function PostFeedback() {
	const [reaction, setReaction] = useState<Reaction>(null);
	const [showForm, setShowForm] = useState(false);
	const [feedback, setFeedback] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleReaction = (r: Reaction) => {
		setReaction(r);
		if (r === "not-helpful") {
			setShowForm(true);
		} else {
			setShowForm(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
	};

	return (
		<motion.div
			className="my-12 rounded-xl border border-border bg-card p-8"
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.5 }}
			viewport={{ once: true }}
			whileInView={{ opacity: 1, y: 0 }}
		>
			<AnimatePresence mode="wait">
				{submitted ? (
					<motion.div
						animate={{ opacity: 1, scale: 1 }}
						className="flex flex-col items-center gap-3 py-4 text-center"
						exit={{ opacity: 0, scale: 0.95 }}
						initial={{ opacity: 0, scale: 0.95 }}
						key="thanks"
					>
						<motion.div
							animate={{ scale: 1 }}
							initial={{ scale: 0 }}
							transition={{
								type: "spring",
								stiffness: 400,
								damping: 15,
								delay: 0.1,
							}}
						>
							<Heart className="h-8 w-8 text-accent" />
						</motion.div>
						<p className="font-semibold text-foreground text-lg">
							Thanks for your feedback!
						</p>
						<p className="text-muted-foreground text-sm">
							Your input helps us write better content.
						</p>
					</motion.div>
				) : (
					<motion.div exit={{ opacity: 0 }} key="form">
						<div className="mb-1 flex items-center gap-2">
							<Sparkles className="h-4 w-4 text-accent" />
							<p className="font-semibold text-muted-foreground text-sm uppercase tracking-widest">
								Feedback
							</p>
						</div>
						<p className="mb-5 font-semibold text-foreground text-lg">
							Was this article helpful?
						</p>

						<div className="mb-4 flex items-center gap-3">
							<motion.button
								className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 font-medium text-sm transition-all duration-200 ${
									reaction === "helpful"
										? "border-accent bg-accent/10 text-accent"
										: "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground"
								}`}
								onClick={() => handleReaction("helpful")}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<ThumbsUp className="h-4 w-4" />
								Yes, helpful
							</motion.button>
							<motion.button
								className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 font-medium text-sm transition-all duration-200 ${
									reaction === "not-helpful"
										? "border-destructive bg-destructive/10 text-destructive"
										: "border-border bg-background text-muted-foreground hover:border-accent/40 hover:text-foreground"
								}`}
								onClick={() => handleReaction("not-helpful")}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<ThumbsDown className="h-4 w-4" />
								Not really
							</motion.button>
						</div>

						{/* Positive reaction quick submit */}
						<AnimatePresence>
							{reaction === "helpful" && (
								<motion.div
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									initial={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
								>
									<motion.button
										className="mt-2 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground text-sm transition-opacity hover:opacity-90"
										onClick={() => setSubmitted(true)}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Send className="h-3.5 w-3.5" /> Submit feedback
									</motion.button>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Negative — show text area */}
						<AnimatePresence>
							{showForm && (
								<motion.form
									animate={{ opacity: 1, height: "auto" }}
									className="overflow-hidden"
									exit={{ opacity: 0, height: 0 }}
									initial={{ opacity: 0, height: 0 }}
									onSubmit={handleSubmit}
									transition={{ duration: 0.3 }}
								>
									<div className="mt-2 flex items-start gap-2">
										<MessageSquare className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground" />
										<textarea
											className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
											onChange={(e) => setFeedback(e.target.value)}
											placeholder="Tell us how we can improve this article..."
											rows={3}
											value={feedback}
										/>
									</div>
									<div className="mt-3 flex justify-end">
										<motion.button
											className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-accent-foreground text-sm transition-opacity hover:opacity-90"
											type="submit"
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<Send className="h-3.5 w-3.5" /> Send feedback
										</motion.button>
									</div>
								</motion.form>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
