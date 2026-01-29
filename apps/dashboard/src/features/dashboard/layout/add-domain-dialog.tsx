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

type Org = {
	id: string;
	name: string;
	slug: string;
	__optimistic?: boolean;
};

// TODO: USE Form from Design System
export function AddDomainDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");

	const queryClient = useQueryClient();

	const createOrganization = useMutation({
		mutationFn: ({ name, slug }: { name: string; slug: string }) =>
			authClient.organization.create({ name, slug }),

		// ✅ OPTIMISTIC INSERT
		onMutate: async ({ name, slug }) => {
			await queryClient.cancelQueries({ queryKey: ["auth", "organizations"] });

			const previousOrgs =
				queryClient.getQueryData<Org[]>(["auth", "organizations"]) ?? [];

			const optimisticOrg = {
				id: `temp-${crypto.randomUUID()}`,
				name,
				slug,
				__optimistic: true,
			};

			queryClient.setQueryData(
				["auth", "organizations"],
				[...previousOrgs, optimisticOrg]
			);

			return { previousOrgs, optimisticId: optimisticOrg.id };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.previousOrgs) {
				queryClient.setQueryData(["auth", "organizations"], ctx.previousOrgs);
			}

			toast.error("Failed to create domain", {
				description: "Something went wrong. Please try again later.",
			});
		},

		onSuccess: async (res, variables, ctx) => {
			// ✅ Replace ONLY the optimistic org
			queryClient.setQueryData(["auth", "organizations"], (orgs: Org[] = []) =>
				orgs.map((org) => (org.id === ctx?.optimisticId ? res.data : org))
			);

			// ✅ Switch active org and sync session
			await authClient.organization.setActive({
				organizationId: res?.data?.id,
			});

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["auth", "session"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "organization"] }),
				queryClient.invalidateQueries({ queryKey: ["auth", "teams"] }),
			]);

			setOpen(false);
			setName("");
			setSlug("");

			toast.success(`${variables.name} is ready`);
		},
	});

	const isLoading = createOrganization.isPending;

	const onNameChange = (value: string) => {
		setName(value);
		setSlug(
			value
				.toLowerCase()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
		);
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createOrganization.mutate({ name, slug });
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild className="h-7">
				<SidebarGroupAction title="Add Domain">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Create New Domain</DialogTitle>
						<DialogDescription>
							Domain names and slugs identify your projects.
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

						<div className="grid gap-2">
							<Label htmlFor="slug">URL Slug</Label>
							<Input
								disabled={isLoading}
								id="slug"
								onChange={(e) => setSlug(e.target.value)}
								required
								value={slug}
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

						<Button disabled={isLoading || !name || !slug} type="submit">
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating…
								</>
							) : (
								"Create Domain"
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
