import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import type { Tag } from "@zero-heads-lab/design-system/components/ui/input-tag";
import { SidebarGroupAction } from "@zero-heads-lab/design-system/components/ui/sidebar";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DomainForm } from "./forms/domain-form";
import { InviteMembersForm } from "./forms/invite-members-form";

export function AddDomainDialog() {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<"create_domain" | "invite_members">(
		"create_domain"
	);

	const handleCreateDomainSuccess: (value: {
		name: string;
		slug: string;
	}) => void = (value) => {
		toast.success(`${value.name} created successfully!`);
		setStep("invite_members");
	};

	const handleCreateDomainError: (error: Error) => void = (error) => {
		console.error("ERROR CREATING DOMAIN", error);
		toast.error("Failed to create domain", {
			description: "Something went wrong. Please try again later.",
		});
	};

	const handleInviteMembersSuccess: (value: { emails: Tag[] }) => void = (
		value
	) => {
		toast.success(`${value.emails.length} members invited successfully!`);
		setOpen(false);
		setStep("create_domain");
	};

	const handleInviteMembersError: (error: Error) => void = (error) => {
		console.error("ERROR INVITING MEMBERS", error);
		toast.error("Failed to invite members", {
			description: "Something went wrong. Please try again later.",
		});
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Domain">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				{step === "create_domain" && (
					<DialogHeader>
						<DialogTitle>Create New Domain</DialogTitle>
						<DialogDescription>
							Domain names and slugs identify your projects.
						</DialogDescription>
					</DialogHeader>
				)}
				{step === "invite_members" && (
					<DialogHeader>
						<DialogTitle>Invite Members</DialogTitle>
						<DialogDescription>
							Invite members to your domain.
						</DialogDescription>
					</DialogHeader>
				)}

				{step === "create_domain" && (
					<DomainForm
						cancelable
						onCancel={() => setOpen(false)}
						onError={handleCreateDomainError}
						onSuccess={handleCreateDomainSuccess}
					/>
				)}
				{step === "invite_members" && (
					<InviteMembersForm
						onCancel={() => setOpen(false)}
						onError={handleInviteMembersError}
						onSuccess={handleInviteMembersSuccess}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
