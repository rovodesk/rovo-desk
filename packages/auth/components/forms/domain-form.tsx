import { useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Building2Icon, Globe } from "lucide-react";
import { z } from "zod";
import { useAuthContext } from "../../client/context";
import { checkDomainSlug, generateSlug } from "../../helpers";
import { useCreateDomain } from "../../hooks";

type DomainFormProps = {
	onSuccess?: (value: { name: string; slug: string }) => void;
	isPending?: boolean;
	cancelable?: boolean;
	onCancel?: () => void;
	submitText?: string;
	defaultValues?: {
		name: string;
		slug: string;
	};
	onError?: (error: Error) => void;
};

const createOrganizationSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters long")
		.max(50, "Name must be at most 50 characters long"),

	slug: z
		.string()
		.min(3, "Slug must be at least 3 characters long")
		.max(32, "Slug must be at most 32 characters long")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens"
		),
});

export function DomainForm({
	onSuccess,
	cancelable = false,
	onCancel,
	submitText = "Create Domain",
	defaultValues,
	onError,
}: DomainFormProps) {
	const queryClient = useQueryClient();
	const { authClient } = useAuthContext();
	const { createDomain, isPending: isCreatingDomain } = useCreateDomain();

	const form = useAppForm({
		defaultValues: {
			name: defaultValues?.name ?? "",
			slug: defaultValues?.slug ?? "",
		},

		// ✅ Proper Zod validation wiring
		validators: {
			onSubmit: ({ value }) => {
				const result = createOrganizationSchema.safeParse(value);

				if (!result.success) {
					const err = z.treeifyError(result.error);
					return err.errors;
				}

				return undefined;
			},
		},

		onSubmit: ({ value }) => {
			createDomain(value, {
				onSuccess: (newDomain) => {
					onSuccess?.(newDomain);
				},
				onError: (error) => {
					onError?.(error);
				},
			});
		},
	});

	const pending = isCreatingDomain;

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
								description="This name will be displayed across the application"
								disabled={pending}
								icon={<Building2Icon />}
								label="Display Name"
								onBlur={field.handleBlur}
								onChange={(e) => {
									const val = e.target.value;

									field.handleChange(val);

									// Auto-generate slug
									form.setFieldValue("slug", generateSlug(val));
								}}
								value={field.state.value}
							/>
						)}
					</form.AppField>

					{/* Slug */}
					<form.AppField
						asyncDebounceMs={500}
						name="slug"
						validators={{
							onChangeAsync: async ({ value }) => {
								if (!value || value.length < 3) return;

								try {
									await queryClient.fetchQuery({
										queryKey: ["auth", "domains", "check", value],
										queryFn: () => checkDomainSlug(authClient, value),
										staleTime: 0, // important for validation
									});

									// If request succeeds → slug is available
									return undefined;
									// biome-ignore lint/suspicious/noExplicitAny: Error Can be any type
								} catch (error: any) {
									if (error?.code === "SLUG_IS_TAKEN") {
										return "This slug is already taken";
									}

									console.error("Unexpected slug validation error:", error);
									return "Error checking availability";
								}
							},
						}}
					>
						{(field) => (
							<field.TextField
								description="A unique slug to identify your organization."
								disabled={pending}
								extraMessage={
									field.state.meta.isValidating
										? "Checking availability..."
										: undefined
								}
								icon={<Globe />}
								label="URL Slug"
								onBlur={field.handleBlur}
								onChange={(e) => {
									field.handleChange(e.target.value);
								}}
								value={field.state.value}
							/>
						)}
					</form.AppField>
				</div>

				<div className="flex justify-end gap-2 pt-4">
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
						disabled={form.state.isValidating || !form.state.isValid}
						loading={pending}
						loadingText="Creating New Organization..."
					>
						{submitText}
					</form.SubmitButton>
				</div>
			</form.AppForm>
		</form>
	);
}
