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
	},
	{
		id: "invite",
		component: InviteStep,
		nextStep: "integration",
	},
	{
		id: "integration",
		component: IntegrationStep,
		nextStep: "appearence",
	},
	{
		id: "appearence",
		component: AppearanceStep,
		nextStep: "identity",
	},
	{
		id: "identity",
		component: IdentityStep,
		nextStep: "subscribe",
	},
	{
		id: "subscribe",
		component: SubscribeStep,
		nextStep: "final",
	},
	{
		id: "final",
		component: FinalStep,
		nextStep: null,
	},
];
