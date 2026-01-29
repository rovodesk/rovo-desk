import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@zero-heads-lab/auth/client";
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
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import { SidebarGroupAction } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

// TODO: USE Form from Design System
export function AddTeamDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");

	const queryClient = useQueryClient();

	const createTeam = useMutation({
		mutationKey: ["organizations-list"],
		mutationFn: ({ name }: { name: string }) =>
			authClient.organization.createTeam({ name }),
		onSuccess: (res, variables) => {
			const newTeam = res.data;

			queryClient.setQueriesData(
				{ queryKey: ["auth", "teams"] },
				(old: [] = []) => [...old, newTeam]
			);

			setOpen(false);
			setName("");

			toast.success(`${variables.name} is ready`);
		},
		onError: (err) => {
			console.error(err);
			toast.error("Failed to create team", {
				description: "Something went wrong. Please try again later.",
			});
		},
	});

	const isLoading = createTeam.isPending;

	const onNameChange = (value: string) => {
		setName(value);
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createTeam.mutate({ name });
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Team">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Team</DialogTitle>
						<DialogDescription>
							Teams are groups of users who can access your organization.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Display Name</Label>
							<Input
								autoFocus
								disabled={isLoading}
								id="name"
								onChange={(e) => onNameChange(e.target.value)}
								required
								value={name}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							disabled={isLoading}
							onClick={() => setOpen(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>

						<Button disabled={isLoading || !name} type="submit">
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating…
								</>
							) : (
								"Create Team"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
