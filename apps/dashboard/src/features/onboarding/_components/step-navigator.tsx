import { useOnboarding } from "@onboardjs/react";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion } from "motion/react";

export function StepNavigator() {
	const { state } = useOnboarding();

	const totalSteps = state?.totalSteps ?? 0;
	const currentStep = state?.currentStepNumber ?? 1;

	// Calculate percentage for the progress bar
	const progress = (currentStep / totalSteps) * 100;

	return (
		<div className="flex w-full max-w-xs flex-col items-center gap-3">
			{/* The Bar Container */}
			<div className="relative h-1.5 w-full overflow-hidden rounded-full border border-border/20 bg-muted/50 backdrop-blur-sm">
				{/* Active Progress Fill */}
				<motion.div
					animate={{ width: `${progress}%` }}
					className="absolute top-0 left-0 h-full bg-linear-to-r from-primary/80 to-primary shadow-[0_0_10px_rgba(var(--primary),0.4)]"
					initial={{ width: 0 }}
					transition={{
						type: "spring",
						stiffness: 80,
						damping: 15,
						mass: 0.8,
					}}
				/>
			</div>

			{/* Segmented Markers (Subtle visual indicators) */}
			<div className="flex w-full justify-between px-0.5">
				{Array.from({ length: totalSteps }).map((_, i) => (
					<motion.div
						animate={{
							scale: currentStep === i + 1 ? 1.2 : 1,
							opacity: currentStep >= i + 1 ? 1 : 0.3,
						}}
						className={cn(
							"size-1 rounded-full transition-colors",
							currentStep >= i + 1 ? "bg-primary" : "bg-muted-foreground"
						)}
						key={i}
					/>
				))}
			</div>

			{/* Micro-label (Optional: removes numbers but keeps context) */}
			<motion.p
				animate={{ opacity: 1, y: 0 }}
				className="font-bold text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]"
				initial={{ opacity: 0, y: 5 }}
				key={currentStep}
			>
				{currentStep === totalSteps ? "Final Step" : "Progressing"}
			</motion.p>
		</div>
	);
}
