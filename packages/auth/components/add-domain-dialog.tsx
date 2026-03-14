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

type AddDomainDialogProps = {
	skipInviteStep?: boolean;
	isOpen: boolean;
	onOpenChange: (value: boolean) => void;
	onSuccess?: () => void;
};

export function AddDomainDialog({
	skipInviteStep = false,
	isOpen,
	onOpenChange,
	onSuccess,
}: AddDomainDialogProps) {
	const [step, setStep] = useState<"create_domain" | "invite_members">(
		"create_domain"
	);

	const handleCreateDomainSuccess = (value: { name: string; slug: string }) => {
		toast.success(`${value.name} created successfully!`);

		if (skipInviteStep) {
			onOpenChange(false);
			onSuccess?.();
			return;
		}

		setStep("invite_members");
	};

	const handleInviteMembersSuccess = (value: { emails: Tag[] }) => {
		toast.success(`${value.emails.length} members invited successfully!`);

		onOpenChange(false);
		setStep("create_domain");
		onSuccess?.();
	};

	return (
		<Dialog
			onOpenChange={(v) => {
				onOpenChange(v);
				if (!v) setStep("create_domain");
			}}
			open={isOpen}
		>
			<DialogTrigger asChild>
				<SidebarGroupAction title="Add Domain">
					<Plus className="size-4" />
				</SidebarGroupAction>
			</DialogTrigger>

			<DialogContent>
				{step === "create_domain" && (
					<>
						<DialogHeader>
							<DialogTitle>Create New Domain</DialogTitle>
							<DialogDescription>
								Domain names and slugs identify your projects.
							</DialogDescription>
						</DialogHeader>

						<DomainForm
							cancelable
							onCancel={() => onOpenChange(false)}
							onError={(error) => {
								console.error(error);
								toast.error("Failed to create domain");
							}}
							onSuccess={handleCreateDomainSuccess}
						/>
					</>
				)}

				{step === "invite_members" && !skipInviteStep && (
					<>
						<DialogHeader>
							<DialogTitle>Invite Members</DialogTitle>
							<DialogDescription>
								Invite members to your domain.
							</DialogDescription>
						</DialogHeader>

						<InviteMembersForm
							onCancel={() => onOpenChange(false)}
							onError={(error) => {
								console.error(error);
								toast.error("Failed to invite members");
							}}
							onSuccess={handleInviteMembersSuccess}
						/>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
