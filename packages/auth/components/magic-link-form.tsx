<<<<<<< HEAD
<<<<<<< HEAD







=======
"use client"

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======

import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { WandSparklesIcon } from "lucide-react";
import { z } from "zod";
import { useLastLoginMethod, useMagicLinkSignIn } from "../hooks";
import { LastLoginBadge } from "./last-login-badge";

>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

const emailSchema = z.object({
	email: z.email("Invalid email address"),
});

type MagicLinkFormProps = {
	isAnyLoading?: boolean;
	callbackURL: string;
};

export default function MagicLinkForm({
	isAnyLoading,
	callbackURL,
}: MagicLinkFormProps) {
	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: emailSchema,
		},
		onSubmit: ({ value }) => {
			signInWithMagicLink(value);
		},
	});

	<<<<<<< HEAD
	const { signInWithMagicLink, isPending } = useMagicLinkSignIn(callbackURL, {
=======
	const { signInWithMagicLink, isPending } = useMagicLinkSignIn({
>>>>>>> 8_137_094 (feat: roles and basic permissions addded, optimzed and refactored)
		onSuccess: () => {
			toast.success("Magic link sent successfully");
		},
		onError: () => {
			toast.error("Could not send magic link", {
				description: "Please try again later.",
			});
		},
}
)

const isLoading = isPending || isAnyLoading;
const { lastLoginMethod } = useLastLoginMethod();

return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<form.AppField
					children={(field) => (
						<field.TextField
							description="We will send you a magic link to login"
							placeholder="Email"
							type="email"
						/>
					)}
					name="email"
				/>

				<form.SubmitButton
					className="relative w-full"
					loading={isLoading}
					loadingText="Sending magic link..."
					size="lg"
				>
					<WandSparklesIcon className="h-5 w-5" />
					Continue With Email
					{lastLoginMethod === "magic-link" && (
						<div className="absolute -top-[1/2] right-3">
							<LastLoginBadge compact />
						</div>
					)}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}

export { MagicLinkForm };
