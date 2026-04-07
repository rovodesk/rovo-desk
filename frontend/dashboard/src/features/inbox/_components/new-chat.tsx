import {
	Avatar,
	AvatarFallback,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@zero-heads-lab/design-system/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type {
	Conversation,
	Participant,
} from "@zero-heads-lab/shared/lib/types";
import { Check, Send, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

type NewChatProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	conversations: Conversation[]; // The full data from conversations.json
};

export function NewChat({ onOpenChange, open, conversations }: NewChatProps) {
	const [selectedUsers, setSelectedUsers] = useState<Participant[]>([]);

	// 1. Extract and Deduplicate Users from conversations
	const availableUsers = useMemo(() => {
		const userMap = new Map<string, Participant>();

		conversations.forEach((conv) => {
			// Usually the first participant is the customer
			const customer = conv.participants.find(
				(p: Participant) => p.type === "customer"
			);
			if (customer && !userMap.has(customer.id)) {
				userMap.set(customer.id, {
					id: customer.id,
					name: customer.name,
					email: customer.email,
					initials: customer.initials,
					avatarColor: customer.avatarColor,
				});
			}
		});

		return Array.from(userMap.values());
	}, [conversations]);

	const handleSelectUser = (user: Participant) => {
		const isSelected = selectedUsers.some((u) => u.id === user.id);
		if (isSelected) {
			setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
		} else {
			setSelectedUsers([...selectedUsers, user]);
		}
	};

	const handleRemoveUser = (userId: string) => {
		setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
	};

	const handleOpenChange = (newOpen: boolean) => {
		onOpenChange(newOpen);
		if (!newOpen) setSelectedUsers([]);
	};

	const handleStartChat = () => {
		toast.success(`Starting chat with ${selectedUsers.length} people`, {
			description: selectedUsers.map((u) => u.name).join(", "),
		});
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[550px]">
				<DialogHeader className="p-6 pb-2">
					<DialogTitle className="flex items-center gap-2">
						<Users className="h-5 w-5 text-primary" />
						New Message
					</DialogTitle>
					<DialogDescription>
						Search for a customer or team member to start a new thread.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col">
					{/* "To:" Field with pill overflow handling */}
					<div className="flex min-h-[44px] flex-wrap items-center gap-2 border-b bg-muted/30 px-6 py-4">
						<span className="mr-1 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
							To:
						</span>
						{selectedUsers.map((user) => (
							<Badge
								className="zoom-in-95 animate-in gap-1 border-primary/20 bg-background py-0.5 pr-0.5 pl-1 duration-200"
								key={user.id}
								variant="secondary"
							>
								<Avatar className="h-4 w-4">
									<AvatarFallback
										className="text-[8px]"
										style={{ backgroundColor: user.avatarColor }}
									>
										{user.initials}
									</AvatarFallback>
								</Avatar>
								<span className="font-medium text-xs">{user.name}</span>
								<Button
									className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
									onClick={() => handleRemoveUser(user.id)}
									size="icon"
									variant="ghost"
								>
									<X className="h-2.5 w-2.5" />
								</Button>
							</Badge>
						))}
						{selectedUsers.length === 0 && (
							<span className="text-muted-foreground/50 text-sm italic">
								No one selected...
							</span>
						)}
					</div>

					<Command className="rounded-none border-none">
						<div className="p-4">
							<CommandInput
								className="h-12 border-none focus:ring-0"
								placeholder="Type a name or email..."
							/>
						</div>
						<CommandList className="max-h-[300px] border-t">
							<CommandEmpty className="py-6 text-center text-sm">
								No contacts found.
							</CommandEmpty>
							<CommandGroup heading="Suggested Contacts">
								{availableUsers.map((user) => {
									const isSelected = selectedUsers.some(
										(u) => u.id === user.id
									);

									return (
										<CommandItem
											className={cn(
												"flex cursor-pointer items-center justify-between px-6 py-3 transition-colors",
												isSelected ? "bg-muted!" : "bg-transparent!",
												"hover:bg-muted/40!",
												"data-[selected=true]:bg-muted!"
											)}
											key={user.id}
											onSelect={() => handleSelectUser(user)}
										>
											<div className="flex items-center gap-3">
												<Avatar className="h-9 w-9 border-2 border-background shadow-sm">
													<AvatarFallback
														className="text-white text-xs"
														style={{ backgroundColor: user.avatarColor }}
													>
														{user.initials}
													</AvatarFallback>
												</Avatar>

												<div className="flex flex-col">
													<span className="font-semibold text-sm leading-tight">
														{user.name}
													</span>
													<span className="text-muted-foreground text-xs">
														{user.email}
													</span>
												</div>
											</div>

											<div
												className={cn(
													"flex h-5 w-5 items-center justify-center rounded-full border transition-all",
													isSelected
														? "border-primary bg-primary text-primary-foreground"
														: "border-muted-foreground/30"
												)}
											>
												{isSelected && <Check className="h-3 w-3" />}
											</div>
										</CommandItem>
									);
								})}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>

				<div className="flex items-center justify-between border-t p-4">
					<p className="px-2 text-[11px] text-muted-foreground">
						{selectedUsers.length > 0
							? `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} selected`
							: "Select at least one contact"}
					</p>
					<div className="flex gap-2">
						<Button
							onClick={() => onOpenChange(false)}
							size="sm"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button
							className="gap-2 shadow-sm"
							disabled={selectedUsers.length === 0}
							onClick={handleStartChat}
							size="sm"
						>
							<Send className="h-3.5 w-3.5" />
							Start Conversation
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
