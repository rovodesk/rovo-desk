import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Building2Icon, Globe } from "lucide-react";
import { z } from "zod";
import { generateSlug } from "../../helpers";

type DomainFormProps = {
	onSubmit: (value: { name: string; slug: string }) => void;
	isPending?: boolean;
	cancelable?: boolean;
	onCancel?: () => void;
	submitText?: string;
	defaultValues?: {
		name: string;
		slug: string;
	};
};

const createOrganizationSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(50, "Name must be at most 50 characters long"),
	slug: z
		.string()
		.min(3, "Slug must be at least 3 characters long")
		.max(32, "Slug must be at most 32 characters long"),
});

export function DomainForm({
	onSubmit,
	isPending,
	cancelable = false,
	onCancel,
	submitText = "Create Domain",
	defaultValues,
}: DomainFormProps) {
	const form = useAppForm({
		defaultValues: {
			name: defaultValues?.name || "",
			slug: defaultValues?.slug || "",
		},
		validators: {
			onSubmit: createOrganizationSchema,
		},
		onSubmit: ({ value }) => {
			toast.success("Domain created successfully", {
				description: `Your domain ${value.name} has been created successfully`,
			});
			onSubmit?.(value);
		},
	});

	function handleNameChange(value: string) {
		form.setFieldValue("slug", generateSlug(value));
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<form.AppField name="name">
							{(field) => (
								<field.TextField
									autoFocus
									description="This name will be displayed all across the application"
									disabled={isPending}
									icon={<Building2Icon />}
									id="name"
									label="Display Name"
									onChange={(e) => {
										handleNameChange(e.target.value);
										field.handleChange(e.target.value);
									}}
								/>
							)}
						</form.AppField>
					</div>

					<div className="grid gap-2">
						<form.AppField name="slug">
							{(field) => (
								<field.TextField
									description="An Unique Slug to identify your organization."
									disabled={isPending}
									icon={<Globe />}
									id="slug"
									label="URL Slug"
								/>
							)}
						</form.AppField>
					</div>
				</div>

				<div className="flex justify-end gap-2 pt-4">
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
						loadingText="Creating..."
					>
						{submitText}
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
