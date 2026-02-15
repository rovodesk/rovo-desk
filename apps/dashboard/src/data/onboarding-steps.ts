import type { OnboardingStep } from "@onboardjs/react";
import { AppearanceStep } from "@/features/onboarding/_components/steps/appearance-step";
import { FinalStep } from "@/features/onboarding/_components/steps/final-step";
import { IdentityStep } from "@/features/onboarding/_components/steps/identity";
import { IntegrationStep } from "@/features/onboarding/_components/steps/integration-step";
import { InviteStep } from "../features/onboarding/_components/steps/invite-step";
import { SubscribeStep } from "../features/onboarding/_components/steps/subscribe-step";
import { WelcomeStep } from "../features/onboarding/_components/steps/welcome-step";
import { WorkspaceStep } from "../features/onboarding/_components/steps/workspace-step";

export const onboardingSteps: OnboardingStep[] = [
	{
		id: "welcome",
		component: WelcomeStep,
		nextStep: "workspace",
	},
	{
		id: "workspace",
		component: WorkspaceStep,
		nextStep: "invite",
		condition: (context) => context.currentUser !== null,
	},
	{
		id: "invite",
		component: InviteStep,
		nextStep: "integration",
		isSkippable: true,
		skipToStep: "integration",
		condition: (context) =>
			context.currentUser?.session?.activeWorkspaceId !== null,
	},
	{
		id: "integration",
		component: IntegrationStep,
		nextStep: "appearence",
		isSkippable: true,
		skipToStep: "appearence",
	},
	{
		id: "appearence",
		component: AppearanceStep,
		nextStep: "identity",
		isSkippable: true,
		skipToStep: "identity",
	},
	{
		id: "identity",
		component: IdentityStep,
		nextStep: "subscribe",
		isSkippable: true,
		skipToStep: "subscribe",
	},
	{
		id: "subscribe",
		component: SubscribeStep,
		nextStep: "final",
		isSkippable: true,
		skipToStep: "final",
	},
	{
		id: "final",
		component: FinalStep,
		nextStep: null,
	},
];
