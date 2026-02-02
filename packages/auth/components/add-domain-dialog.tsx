import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { SidebarGroupAction } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useCreateDomain } from "../hooks";

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

export function AddDomainDialog() {
	const [open, setOpen] = useState(false);

	const { createDomain, isPending } = useCreateDomain({
		onSuccess: (variables) => {
			toast.success(`${variables.name} created successfully!`);
			setOpen(false);
		},
		onError: () => {
			toast.error("Failed to create domain", {
				description: "Something went wrong. Please try again later.",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			slug: "",
		},
		validators: {
			onSubmit: createOrganizationSchema,
		},
		onSubmit: ({ value }) => {
			createDomain(value);
		},
	});

	function handleNameChange(value: string) {
		form.setFieldValue(
			"slug",
			value
				.toLowerCase()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
		);
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild className="h-7">
				<SidebarGroupAction title="Add Domain">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.AppForm>
						<DialogHeader>
							<DialogTitle>Create New Domain</DialogTitle>
							<DialogDescription>
								Domain names and slugs identify your projects.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							{/* Name */}
							<div className="grid gap-2">
								<Label htmlFor="name">Display Name</Label>

								<form.AppField name="name">
									{(field) => (
										<field.TextField
											autoFocus
											disabled={isPending}
											id="name"
											onChange={(e) => {
												handleNameChange(e.target.value);
												field.handleChange(e.target.value);
											}}
										/>
									)}
								</form.AppField>
							</div>

							{/* Slug */}
							<div className="grid gap-2">
								<Label htmlFor="slug">URL Slug</Label>

								<form.AppField name="slug">
									{(field) => (
										<field.TextField disabled={isPending} id="slug" />
									)}
								</form.AppField>
							</div>
						</div>

						<DialogFooter>
							<Button
								disabled={isPending}
								onClick={() => setOpen(false)}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>

							<form.SubmitButton
								disabled={isPending}
								loading={isPending}
								loadingText="Creating..."
							>
								Create Domain
							</form.SubmitButton>
						</DialogFooter>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
