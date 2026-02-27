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
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useTeam } from "../hooks/use-team";

const createTeamSchema = z.object({
	name: z
		.string()
		.min(3, "Team name must be at least 3 characters long")
		.max(20, "Team name must be at most 20 characters long"),
});

export function AddTeamDialog() {
	const [open, setOpen] = useState(false);

	const { createTeamAsync, loading } = useTeam();

	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: createTeamSchema,
		},
		onSubmit: async ({ value }) => {
			await createTeamAsync(value);
		},
	});

	if (loading) {
		<Skeleton className="h-20 w-10" />;
	}

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
									{(field) => <field.TextField autoFocus disabled={loading} />}
								</form.AppField>
							</div>
						</div>

						<DialogFooter>
							<Button
								disabled={loading}
								onClick={() => setOpen(false)}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>

							<form.SubmitButton
								disabled={loading}
								loading={loading}
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
