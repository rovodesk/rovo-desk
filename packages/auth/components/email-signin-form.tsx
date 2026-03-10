import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useSignIn } from "../hooks";
import { LastLoginBadge } from "./last-login-badge";

const emailSchema = z.object({
	email: z.email("Invalid email address"),
});

type EmailSignInFormProps = {
	isAnyLoading?: boolean;
};

export const EmailSignInForm = ({ isAnyLoading }: EmailSignInFormProps) => {
	const [loginMethod, setLoginMethod] = useState<"email" | "sso">("email");

	const {
		signInWithMagicLinkAsync,
		signInWithSSOAsync,
		loading,
		lastLoginMethod,
	} = useSignIn();

	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: emailSchema,
		},
		onSubmit: async ({ value }) => {
			if (loginMethod === "email") {
				await signInWithMagicLinkAsync({ email: value.email });
			} else {
				await signInWithSSOAsync({ email: value.email });
			}
		},
	});

	const isLoading = loading || isAnyLoading;

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
					icon={<WandSparklesIcon className="h-5 w-5" />}
					loading={isLoading}
					loadingText="Sending magic link..."
					onClick={() => setLoginMethod("email")}
					size="lg"
				>
					Continue With Email
					{lastLoginMethod === "magic-link" && (
						<div className="absolute -top-[1/2] right-3">
							<LastLoginBadge compact />
						</div>
					)}
				</form.SubmitButton>

				<form.SubmitButton
					className="relative w-full"
					icon={<WandSparklesIcon className="h-5 w-5" />}
					loading={isLoading}
					loadingText="Sending magic link..."
					onClick={() => setLoginMethod("sso")}
					size="lg"
				>
					Continue With SSO
					{lastLoginMethod === "sso" && (
						<div className="absolute -top-[1/2] right-3">
							<LastLoginBadge compact />
						</div>
					)}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
};

export default EmailSignInForm;
