import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import type { Tag } from "@zero-heads-lab/design-system/components/ui/input-tag";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { useState } from "react";
import { z } from "zod";
import type { AuthRole } from "../../access-control";
import { useOrganization } from "../../hooks";

const FormSchema = z.object({
	emails: z
		.array(
			z.object({
				id: z.string(),
				text: z.string().email("Invalid email format"),
			})
		)
		.min(1, "Add at least one email"),
	role: z.string(),
});

type InviteMembersFormProps = {
	onSuccess?: (value: { emails: Tag[] }) => void;
	cancelable?: boolean;
	onCancel?: () => void;
	onError?: (error: Error) => void;
	submitText?: string;
	defaultValues?: {
		emails: Tag[];
		role: AuthRole;
	};
	maxValues?: number;
};

export function InviteMembersForm({
	onSuccess,
	cancelable = false,
	onCancel,
	onError,
	submitText = "Send Invites",
	defaultValues,
	maxValues,
}: InviteMembersFormProps) {
	const { inviteMemberAsync } = useOrganization();
	const [submitting, setSubmitting] = useState(false);
	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

	const maxEmails = maxValues ?? 30;

	const form = useAppForm({
		defaultValues: {
			emails: defaultValues?.emails ?? [],
			role: defaultValues?.role ?? "member",
		},
		validators: {
			onChange: ({ value }) => {
				if (value.emails.length > maxEmails) {
					return { emails: `Add at most ${maxEmails} emails` };
				}
				const result = FormSchema.safeParse(value);
				if (!result.success) {
					// Returns the first error message found
					return result.error.flatten().fieldErrors;
				}
				return undefined;
			},
		},
		onSubmit: async ({ value }) => {
			setSubmitting(true);
			try {
				const results = await Promise.allSettled(
					value.emails.map(({ text }) =>
						inviteMemberAsync({ email: text, role: value.role })
					)
				);

				const failed = results.filter(
					(r): r is PromiseRejectedResult => r.status === "rejected"
				);

				if (failed.length > 0) {
					toast.error(`${failed.length} invite(s) failed`);
					for (const fails of failed) {
						onError?.(fails.reason);
					}
				} else {
					toast.success("Invitations sent successfully");
					onSuccess?.({ emails: value.emails });
				}
			} catch (error) {
				toast.error("Something went wrong");
				onError?.(error as Error);
			} finally {
				setSubmitting(false);
			}
		},
	});

	const isDisabled =
		!form.state.isValid || form.state.isValidating || submitting;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<form.AppField name="emails">
					{(field) => (
						<div className="relative">
							<div className="absolute top-2 right-3 text-muted-foreground text-xs">
								{field.state.value?.length ?? 0} / {maxEmails}
							</div>
							<field.TagInputField
								{...field}
								activeTagIndex={activeTagIndex}
								className="pr-16"
								label="Invite team members"
								maxTags={maxEmails}
								placeholder="Type email and press enter..."
								setActiveTagIndex={setActiveTagIndex}
							/>
						</div>
					)}
				</form.AppField>

				<div className="mt-6 flex justify-end gap-2 pt-4">
					{cancelable && (
						<Button
							disabled={submitting}
							onClick={onCancel}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					)}

					<form.SubmitButton
						disabled={isDisabled}
						loading={submitting}
						loadingText="Sending..."
					>
						{submitText}
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
