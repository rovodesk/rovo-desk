import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import type { Tag } from "@zero-heads-lab/design-system/components/ui/input-tag";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { batch } from "@zero-heads-lab/shared/utils";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useInviteMembers } from "../../hooks/use-invite-members";

const FormSchema = z.object({
	emails: z
		.array(
			z.object({
				id: z.string(),
				text: z.email("Invalid email format"),
			})
		)
		.min(1, "Add at least one email"),
});

type InviteMembersFormProps = {
	onSubmit?: (value: { emails: Tag[] }) => void;
	isPending?: boolean;
	cancelable?: boolean;
	onCancel?: () => void;
	submitText?: string;
	defaultValues?: {
		emails: Tag[];
	};
	maxValues?: number;
};

export function InviteMembersForm({
	onSubmit,
	isPending,
	cancelable = false,
	onCancel,
	submitText = "Send Invites",
	defaultValues,
	maxValues = 3,
}: InviteMembersFormProps) {
	const { inviteMembers, isPending: isInvitePending } = useInviteMembers();

	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

	const form = useAppForm({
		defaultValues: {
			emails: defaultValues?.emails ?? ([] as Tag[]),
			role: "organizationMember",
		},

		validators: {
			onSubmit: ({ value }) => {
				if (value.emails.length > maxValues) {
					return {
						emails: {
							message: `Add at most ${maxValues} emails`,
						},
					};
				}

				const result = FormSchema.safeParse(value);

				if (!result.success) {
					const err = z.treeifyError(result.error);
					return err.errors;
				}

				return undefined;
			},
		},

		onSubmit: ({ value }) => {
			// ✅ Push each email into the SAME batch
			value.emails.forEach(({ text }) => {
				inviteBatch(text);
			});
		},
	});

	/**
	 * ✅ Create ONE batch instance
	 * It will collect emails and send them grouped.
	 */
	const inviteBatch = useMemo(
		() =>
			batch<string>(
				(emails) => {
					for (const email of emails) {
						inviteMembers(
							{
								email, // ✅ single email
								role: "organizationMember",
							},
							{
								onError: () => {
									toast.error(`Failed to invite ${email}`);
								},
							}
						);
					}

					onSubmit?.({
						emails: form.state.values.emails,
					});
				},
				{
					maxSize: maxValues,
					wait: 2000,
				}
			),
		[inviteMembers, maxValues, onSubmit, form.state.values.emails]
	);

	const pending = isPending || isInvitePending;

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
					{(field) => {
						const currentCount = field.state.value?.length ?? 0;

						return (
							<div className="relative">
								<div className="absolute top-2 right-3 font-medium text-muted-foreground text-xs">
									{currentCount} / {maxValues}
								</div>

								<field.TagInputField
									{...field}
									activeTagIndex={activeTagIndex}
									className="pr-16"
									label="Invite team members"
									maxTags={maxValues}
									placeholder="Type email and press enter..."
									setActiveTagIndex={setActiveTagIndex}
								/>
							</div>
						);
					}}
				</form.AppField>

				<div className="mt-6 flex w-full justify-end gap-2 pt-4">
					{cancelable && (
						<Button
							disabled={pending}
							onClick={onCancel}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					)}

					<form.SubmitButton
						disabled={!form.state.isValid}
						loading={pending}
						loadingText="Sending..."
					>
						{submitText}
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
