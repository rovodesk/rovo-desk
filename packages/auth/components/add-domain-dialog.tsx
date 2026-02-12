import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { SidebarGroupAction } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateDomain } from "../hooks";
import { DomainForm } from "./forms/domain-form";

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

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Domain">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Domain</DialogTitle>
					<DialogDescription>
						Domain names and slugs identify your projects.
					</DialogDescription>
				</DialogHeader>

				<DomainForm
					isPending={isPending}
					onCancel={() => setOpen(false)}
					onSubmit={(value) => createDomain(value)}
				/>
			</DialogContent>
		</Dialog>
	);
}
