import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_authenticated/get-started/")({
	// beforeLoad: ({ context }) => requireAuth({ auth: context.auth }),
	validateSearch: z.object({
		step: z.string().optional(),
	}),
	component: Onboarding,
});

function Onboarding() {
	const { step } = Route.useSearch();
	console.log(step);
	// return <>Onboarding</>;
}
