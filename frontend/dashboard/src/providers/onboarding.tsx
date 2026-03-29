import type { DataLoadFn, DataPersistFn } from "@onboardjs/core";
import { OnboardingProvider as OnboardJSProvider } from "@onboardjs/react";
import { Loader } from "@zero-heads-lab/design-system/components/loader";
import { onboardingSteps } from "@/data/onboarding-steps";
import { useProfile } from "@/hooks/use-profile";

export function OnboardingProvider({
	children,
}: {
	children?: React.ReactNode;
}) {
	const {
		onboardingProgress,
		persistOnboardingProgressMutationAsync,
		clearOnboardingProgressMutationAsync,
		loading,
	} = useProfile();

	/*
	 * LOAD FROM DATABASE
	 */
	const handleDataLoad: DataLoadFn = () => {
		if (!onboardingProgress) {
			return {
				context: {},
				currentStepId: "welcome",
			};
		}

		return {
			context: onboardingProgress.flowData ?? {},
			currentStepId: onboardingProgress.currentStepId ?? "welcome",
		};
	};

	/*
	 * PERSIST TO DATABASE
	 */
	const handleDataPersist: DataPersistFn = async (context, currentStepId) => {
		await persistOnboardingProgressMutationAsync({
			currentStepId: String(currentStepId),
			flowData: context,
		});
	};

	/*
	 * CLEAR DATABASE STATE
	 */
	const handleClearPersistedData = async () => {
		await clearOnboardingProgressMutationAsync();
	};

	if (loading) {
		return (
			<Loader
				subtitle="Please wait while we prepare your workspace"
				title="Speeding things up..."
			/>
		);
	}

	return (
		<OnboardJSProvider
			customOnClearPersistedData={handleClearPersistedData}
			customOnDataLoad={handleDataLoad}
			customOnDataPersist={handleDataPersist}
			steps={onboardingSteps}
		>
			{children}
		</OnboardJSProvider>
	);
}
