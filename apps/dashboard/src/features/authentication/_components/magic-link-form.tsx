import { useMutation } from "@tanstack/react-query";
import { authClient } from "@zero-heads-lab/auth/client";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { capitalize, Placeholder } from "@zero-heads-lab/shared/utils";
import { WandSparklesIcon } from "lucide-react";
import z from "zod";

const emailSchema = z.object({
	email: z.email("Invalid email address"),
});

type MagicLinkFormProps = {
	isAnyLoading?: boolean;
};

export default function MagicLinkForm({ isAnyLoading }: MagicLinkFormProps) {
	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onSubmit: emailSchema,
		},
		onSubmit: async ({ value }) => {
			await signIn(value);
		},
	});

	const { mutate: signIn, isPending } = useMutation({
		mutationFn: async ({ email }: { email: string }) => {
			return await authClient.signIn.magicLink({
				email,
				name: capitalize(Placeholder.name(2, " ")),
				callbackURL: "/",
			});
		},
		onError: (error) => {
			console.error("Error signing in", error);
			toast.error("Login failed", {
				description: "Could not authenticate. Please try again later.",
			});
		},
	});

	const isLoading = isPending || isAnyLoading;

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
					className="w-full"
					loading={isLoading}
					loadingText="Sending magic link..."
					size="lg"
				>
					<WandSparklesIcon className="h-5 w-5" />
					Continue With Email
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
}

export { MagicLinkForm };
