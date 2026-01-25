//TODO: ADD SYNC

import { useOrganizationList } from "@clerk/tanstack-react-start";
import { convexQuery } from "@convex-dev/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@zero-heads-lab/backend/convex/_generated/api";
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

export function AddDomainDialog() {
	//TODO: USE Friendly words
	const defaultName = "test-org";
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(defaultName);
	const [slug, setSlug] = useState(defaultName);
	const [pending, setPending] = useState(false);

	const { createOrganization } = useOrganizationList();
	const queryClient = useQueryClient();

	const onNameChange = (value: string) => {
		setName(value);
		setSlug(
			value
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "")
		);
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!createOrganization) return;

		try {
			setPending(true);
			await createOrganization({ name, slug });

			await queryClient.invalidateQueries({
				queryKey: convexQuery(api.functions.organizations.listUserDomains, {})
					.queryKey,
			});

			toast.success("Domain created");
			setOpen(false);
			setName("");
			setSlug("");
			// biome-ignore lint/suspicious/noExplicitAny: Error can be of any type
		} catch (err: any) {
			toast.error("Failed to create domain", {
				description: err?.errors?.[0]?.message ?? "Please try again",
			});
		} finally {
			setPending(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Domain">
					<Plus />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>Add New Domain</DialogTitle>
						<DialogDescription>Create a new organization.</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label>Name</Label>
							<Input
								disabled={pending}
								onChange={(e) => onNameChange(e.target.value)}
								required
								value={name}
							/>
						</div>

						<div className="grid gap-2">
							<Label>Slug</Label>
							<Input
								disabled={pending}
								onChange={(e) => setSlug(e.target.value)}
								placeholder="example"
								required
								value={slug}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							disabled={pending}
							onClick={() => setOpen(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={pending || !name} type="submit">
							{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create Domain
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
