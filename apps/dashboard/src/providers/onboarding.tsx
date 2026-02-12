import { OnboardingProvider as OnboardJSProvider } from "@onboardjs/react";
import { onboardingSteps } from "@/data/onboarding-steps";

export function OnboardingProvider({
	children,
}: {
	children?: React.ReactNode;
}) {
	// TODO: ADD DATABASE PERSISTANCE
	// const handleDataLoad: DataLoadFn = async () => {
	// 	// Api Call to load data
	// 	const res = await fetch("/api/rpc/onboarding");
	// 	return await res.json();
	// };

	// const handleDataPersist: DataPersistFn = async (context, currentStepId) => {
	// 	console.log("Persisting Onboarding data:", context, currentStepId);
	// 	const formData = new FormData();
	// 	formData.append("context", JSON.stringify(context));
	// 	formData.append("currentStepId", String(currentStepId));
	// 	// API call to persist data
	// 	await fetch("/api/rpc/onboarding", {
	// 		method: "POST",
	// 		body: formData,
	// 	});
	// };

	// const handleClearPersistedData: DataClearPersistFn = async () => {
	// 	// Api Call to clear data
	// 	await fetch("/api/rpc/onboarding", {
	// 		method: "DELETE",
	// 	});
	// };

	return (
		<OnboardJSProvider
			// customOnClearPersistedData={handleClearPersistedData}
			// customOnDataLoad={handleDataLoad}
			// customOnDataPersist={handleDataPersist}
			localStoragePersistence={{
				key: "zero-heads:onboarding-flow",
				ttl: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (optional)
			}}
			steps={onboardingSteps}
		>
			{children}
		</OnboardJSProvider>
	);
}
