import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Placeholder } from "@zero-heads-lab/shared/lib/utils";
import { Building2Icon, ClockIcon } from "lucide-react";
import { z } from "zod";
import { useApiKeys } from "../../hooks/use-apikey";

type ApiKeyFormProps = {
	onSuccess?: (value: {
		id?: string;
		key?: string;
		prefix?: string;
		name?: string;
		expiresIn?: number | null;
	}) => void;
	cancelable?: boolean;
	isLoading?: boolean;
	onCancel?: () => void;
	submitText?: string;
	onError?: (error: Error) => void;
};

const createApiKeySchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(50, "Name must be at most 50 characters long"),

	description: z.string().optional(),

	expiresIn: z.number().optional(),
});

export function ApiKeyForm({
	onSuccess,
	cancelable = false,
	onCancel,
	submitText = "Create API Key",
	onError,
}: ApiKeyFormProps) {
	const { createApiKey, isLoading } = useApiKeys();

	const form = useAppForm({
		defaultValues: {
			name: Placeholder.name(3, "-"),
			description: "",
			expiresIn: 60 * 60 * 24 * 7,
		},

		validators: {
			onSubmit: ({ value }) => {
				const result = createApiKeySchema.safeParse(value);
				if (!result.success) {
					const err = z.treeifyError(result.error);
					return err.errors;
				}

				return undefined;
			},
		},

		onSubmit: ({ value }) => {
			createApiKey(
				{
					name: value.name,
					metadata: {
						description: value.description,
					},
					expiresIn: value.expiresIn,
				},
				{
					onSuccess: (value) => {
						onSuccess?.(value.data ?? value);
					},
					onError: (error) => {
						toast.error(error.message);
						onError?.(error);
					},
				}
			);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppForm>
				<div className="grid gap-4 py-4">
					{/* Name */}
					<form.AppField name="name">
						{(field) => (
							<field.TextField
								autoFocus
								description="Give your API key a memorable name to easily identify it later."
								disabled={isLoading}
								icon={<Building2Icon />}
								label="Name"
								onBlur={field.handleBlur}
								value={field.state.value}
							/>
						)}
					</form.AppField>
					{/* Description */}
					<form.AppField name="description">
						{(field) => (
							<field.TextField
								disabled={isLoading}
								label="Description"
								onBlur={field.handleBlur}
								value={field.state.value}
							/>
						)}
					</form.AppField>
					{/* Expiry */}
					<form.AppField name="expiresIn">
						{(field) => (
							<field.SelectField
								description="By Default API Key will expire in 1 Week if not set"
								disabled={isLoading}
								icon={<ClockIcon />}
								label="Expiry"
								options={[
									{ label: "1 Day", value: 60 * 60 * 24 },
									{ label: "1 Week", value: 60 * 60 * 24 * 7 },
									{ label: "1 Month", value: 60 * 60 * 24 * 30 },
									{ label: "1 Year", value: 60 * 60 * 24 * 365 },
								]}
								placeholder="Select Expiration Period"
							/>
						)}
					</form.AppField>
				</div>

				<div className="flex justify-end gap-2 pt-4">
					{cancelable && (
						<Button
							disabled={isLoading}
							onClick={onCancel}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
					)}

					<form.SubmitButton
						disabled={form.state.isSubmitting}
						loading={isLoading}
						loadingText="Creating New Api Key..."
					>
						{submitText}
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
