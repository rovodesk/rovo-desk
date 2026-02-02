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
import { useCreateTeam } from "../hooks/use-create-team";

const createTeamSchema = z.object({
	name: z
		.string()
		.min(3, "Team name must be at least 3 characters long")
		.max(20, "Team name must be at most 20 characters long"),
});

export function AddTeamDialog() {
	const [open, setOpen] = useState(false);

	const { createTeam, isPending } = useCreateTeam({
		onSuccess: (value) => {
			toast.success(`Team ${value.name} created successfully`);
			setOpen(false);
		},
		onError: () => {
			toast.error("Failed to create team", {
				description: "Please try again later",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: createTeamSchema,
		},
		onSubmit: ({ value }) => {
			createTeam(value);
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Team">
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
							<DialogTitle>Create New Team</DialogTitle>
							<DialogDescription>
								Teams are groups of users who can access your organization.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="name">Team Name</Label>

								<form.AppField name="name">
									{(field) => (
										<field.TextField autoFocus disabled={isPending} />
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
								Create Team
							</form.SubmitButton>
						</DialogFooter>
					</form.AppForm>
				</form>
			</DialogContent>
		</Dialog>
	);
}
