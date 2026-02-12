import { useOnboarding } from "@onboardjs/react";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { StepNavigator } from "./_components/step-navigator";
import { FinalStep } from "./_components/steps/final-step";

export function OnboardingFlow() {
	const { renderStep, currentStep } = useOnboarding();

	// If onboarding is finished, render the celebration screen
	if (currentStep === null) {
		return (
			<div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
				<FinalStep />
			</div>
		);
	}

	return (
		<main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background">
			{/* 1. Stable Viewport Container 
                We use a fixed max-width and min-height to prevent layout shifting
            */}
			<div className="flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-12">
				{/* 2. The Content Area 
                    Setting a min-height here prevents the "jump" when switching steps.
                    We use a flexible but stable container for renderStep.
                */}
				<div
					className={cn(
						"flex w-full flex-col items-center justify-center transition-all duration-500",
						"min-h-[600px]" // Ensures the footer (navigator) doesn't jump up and down
					)}
				>
					{renderStep()}
				</div>

				{/* 3. Fixed Footer / Navigator 
                    By placing this outside the renderStep but inside the flex-col,
                    we ensure it always maintains its relative distance from the bottom.
                */}
				<footer className="fade-in slide-in-from-bottom-2 mt-12 flex w-full animate-in justify-center border-border/40 border-t pt-8 duration-700">
					<StepNavigator />
				</footer>
			</div>

			{/* Subtle background decoration to keep it "SaaS-ready" */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-[10%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
				<div className="absolute right-0 bottom-0 left-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
			</div>
		</main>
	);
}
