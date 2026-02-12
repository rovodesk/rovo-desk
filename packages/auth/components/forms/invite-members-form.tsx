import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import type { Tag } from "@zero-heads-lab/design-system/components/ui/input-tag";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// 1. Update Schema to expect an array of Tag objects
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
	const form = useAppForm({
		defaultValues: {
			emails: defaultValues?.emails || ([] as Tag[]),
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
				return FormSchema.parse(value);
			},
		},
		onSubmit: ({ value }) => {
			// 3. Extract just the text (emails) from the tags
			const emailList = value.emails.map((tag) => tag.text);

			// Simulate API call or logic
			console.log("Sending invites to:", emailList);

			toast.success(
				<span className="flex items-center gap-2">
					<InfoIcon className="inline-block size-4" />{" "}
					{`Sent ${emailList.length} invite(s)`}
				</span>,
				{
					description: (
						<div className="mt-2 flex flex-wrap gap-1">
							{emailList.map((email) => (
								<div className="font-medium text-primary" key={email}>
									{email}
								</div>
							))}
						</div>
					),
				}
			);

			onSubmit?.({ emails: value.emails });
		},
	});

	const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

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
								{/* Corner Counter */}
								<div className="absolute top-2 right-3 font-medium text-muted-foreground text-xs">
									{currentCount} / {maxValues}
								</div>

								<field.TagInputField
									activeTagIndex={activeTagIndex}
									className="pr-16"
									label="Invite team members"
									maxTags={maxValues}
									placeholder="Type email and press enter..."
									setActiveTagIndex={setActiveTagIndex}
									{...field}
								/>
							</div>
						);
					}}
				</form.AppField>

				<div className="mt-6 flex w-full justify-end gap-2 pt-4">
					{cancelable && (
						<Button
							disabled={isPending}
							onClick={onCancel}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					)}

					<form.SubmitButton
						disabled={isPending}
						loading={isPending}
						loadingText="Sending..."
					>
						{submitText}
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
