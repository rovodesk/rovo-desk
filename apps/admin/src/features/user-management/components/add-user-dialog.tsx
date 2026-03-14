import { useAdmin } from "@zero-heads-lab/auth/hooks/use-admin";
import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Label } from "@zero-heads-lab/design-system/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { useState } from "react";

interface UserAddDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function UserAddDialog({
	isOpen,
	onClose,
	onSuccess,
}: UserAddDialogProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "owner" as "member" | "admin" | "owner",
		autoVerify: false,
	});

	const { createUserAsync, isCreatingUser } = useAdmin();

	const handleCreateUser = async () => {
		try {
			await createUserAsync(formData);
			toast.success(
				formData.autoVerify
					? "User created and verified successfully"
					: "User created successfully. Verification email sent."
			);
			onSuccess?.();
			onClose();
			// Reset form
			setFormData({
				name: "",
				email: "",
				role: "member",
				autoVerify: false,
			});
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<ConfirmDialog
			confirmText={isCreatingUser ? "Creating..." : "Create User"}
			onConfirm={handleCreateUser}
			onOpenChange={onClose}
			open={isOpen}
			subtitle="Create a new user account with the following details."
			title="Add New User"
		>
			<div className="grid gap-4 py-4">
				<div className="grid gap-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						placeholder="Enter user's name"
						required
						value={formData.name}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, email: e.target.value }))
						}
						placeholder="Enter user's email"
						required
						type="email"
						value={formData.email}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="role">Role</Label>
					<Select
						onValueChange={(value: "member" | "admin" | "owner") =>
							setFormData((prev) => ({ ...prev, role: value }))
						}
						value={formData.role}
					>
						<SelectTrigger className="w-full" id="role">
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="owner">Owner</SelectItem>
							<SelectItem value="admin">Admin</SelectItem>
							<SelectItem value="member">Member</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center justify-between">
					<Label className="cursor-pointer" htmlFor="autoVerify">
						Auto-verify email
					</Label>
					<Switch
						checked={formData.autoVerify}
						id="autoVerify"
						onCheckedChange={(checked: boolean) =>
							setFormData((prev) => ({ ...prev, autoVerify: checked }))
						}
					/>
				</div>
			</div>
		</ConfirmDialog>
	);
}
