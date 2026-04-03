// import { type StepComponentProps, useOnboarding } from "@onboardjs/react";
// import { DomainForm } from "@zero-heads-lab/auth/components/forms/domain-form";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { Globe, LayoutPanelLeft } from "lucide-react";

export function WorkspaceStep(
	{
		className,
		// context,
		...props
	}: React.ComponentProps<"div">
	// & StepComponentProps
) {
	// const { updateContext, next, loading: isOnboardingLoading } = useOnboarding();

	// const defaultValues = {
	// 	name: context.flowData?.name || "",
	// 	slug: context.flowData?.slug || "",
	// };

	// const pending = isOnboardingLoading.isAnyLoading;

	// const handleWorkspaceStepSubmit = (value: { name: string; slug: string }) => {
	// 	updateContext({
	// 		flowData: {
	// 			...value,
	// 		},
	// 	});
	// 	next();
	// };

	return (
		<div
			className={cn(
				"fade-in slide-in-from-bottom-4 mx-auto w-full max-w-2xl animate-in px-4 py-8 duration-700",
				className
			)}
			{...props}
		>
			<div className="flex flex-col items-center gap-8 text-center">
				{/* Header Section */}
				<div className="space-y-3">
					<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
						<LayoutPanelLeft className="size-6" />
					</div>
					<h1 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
						Create your workspace
					</h1>
					<p className="mx-auto max-w-[480px] text-muted-foreground">
						This is where your team will collaborate. You can always change
						these settings later in your dashboard.
					</p>
				</div>

				{/* Form Container (The "Card") */}
				<div className="relative w-full max-w-[540px] rounded-xl border bg-card p-1 shadow-2xl shadow-primary/5">
					{/* Subtle inner glow for that "Premium App" feel */}
					<div className="rounded-[10px] bg-background px-6 py-8 sm:px-10">
						<div className="mb-6 flex items-center gap-2 text-left font-medium text-muted-foreground text-sm">
							<Globe className="size-4" />
							<span>Workspace Identity</span>
						</div>

						{/* <DomainForm
							cancelable
							defaultValues={defaultValues}
							isPending={pending}
							onCancel={() => next()}
							onSubmit={handleWorkspaceStepSubmit}
						/> */}
					</div>
				</div>

				{/* Footer Hint */}
				<p className="text-muted-foreground text-sm">
					Tip: Most teams use their company name or department.
				</p>
			</div>
		</div>
	);
}
