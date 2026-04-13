import { useMutation } from "@tanstack/react-query";
import {
	type PartialBlock,
	RichTextEditor,
} from "@zero-heads-lab/design-system/components/editor";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Checkbox } from "@zero-heads-lab/design-system/components/ui/checkbox";
import {
	InputGroup,
	InputGroupButton,
	InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { Placeholder } from "@zero-heads-lab/shared/lib/utils";
import {
	Calendar,
	CheckSquare,
	CloudUpload,
	MoreHorizontal,
	Proportions,
	Send,
	Smile,
	Star,
	X,
} from "lucide-react";
import { useState } from "react";
import { avatars } from "@/data/active-avatars";
import { useUser } from "@/hooks/use-user";
import { MainContent } from "@/layout/main-content";
import { pickUserColor } from "@/lib/utils/pick-color";
import { ActiveAvatars } from "./_components/active-avatars";

const useKnowledgeById = (id: string) => {
	return {
		data: {
			id,
			title: "Complete 2 DSP Chapters",
			content: null,
		},
		isLoading: false,
	};
};

export function Document({ id }: { id: string }) {
	const { data: knowledge, isLoading } = useKnowledgeById(id);
	const [isSaving, setIsSaving] = useState(false);
	const [isFavourite, setIsFavourite] = useState<boolean>(false);
	const [wideLayout, setWideLayout] = useState(false);

	// Page Decorative States
	const [showIcon, setShowIcon] = useState(false);

	const { data: user } = useUser();
	const name = user?.name;
	const userAvatar = user?.picture ?? Placeholder.avatar(user?.email);
	const userColor = pickUserColor(user?.id);

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			toast.success("All changes synced");
		}, 1000);
	};

	const update = useMutation({
		mutationFn: async (data: { content: PartialBlock[] }) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return console.log(data);
		},
		onSuccess: () => toast.success("Changes synced"),
	});
	const handleOnChange = (content: PartialBlock[]) => {
		update.mutate({ content });
	};

	// Add to Favourite
	function handleAddToFavorite() {
		setIsFavourite((prev) => !prev);
		toast.success("Added to favorites");
	}

	// const ydoc = useMemo(() => new Y.Doc(), []);

	// const provider = useMemo(
	// 	() => partyKitProvider(knowledge.id, ydoc),
	// 	[knowledge.id, ydoc]
	// );

	// Collaboration Options
	// const collaborationOptions = useMemo(
	// 	() => ({
	// 		provider,
	// 		fragmentName: knowledge.id,
	// 		doc: ydoc,
	// 		user: {
	// 			id: user?.id,
	// 			name,
	// 			color: userColor,
	// 			username: name,
	// 			avatarUrl: userAvatar,
	// 		},
	// 		resolveUsers: (userIds: string[]) => {
	// 			const states = provider.awareness.getStates();

	// 			const usersById = new Map();

	// 			states.forEach((state) => {
	// 				if (state?.user?.id) {
	// 					usersById.set(state.user.id, state.user);
	// 				}
	// 			});

	// 			return userIds.map((userId) => {
	// 				const u = usersById.get(userId);

	// 				return {
	// 					id: userId,
	// 					name: u?.name ?? "Unknown",
	// 					color: u?.color ?? "#000000",
	// 					username: u?.username ?? u?.name ?? "unknown",
	// 					avatarUrl: u?.avatarUrl ?? "",
	// 				};
	// 			});
	// 		},
	// 	}),
	// 	[provider, ydoc, knowledge.id, name, userColor, user?.id, userAvatar]
	// );

	if (isLoading) return <DocumentSkeleton />;

	return (
		<MainContent
			className="flex flex-1 flex-col overflow-y-auto p-0"
			headerLeftContent={
				<Button
					onClick={() => setWideLayout((prev) => !prev)}
					size="icon"
					variant="ghost"
				>
					<Proportions />
				</Button>
			}
			headerRightContent={
				<div className="ms-auto flex items-center justify-between space-x-6">
					<ActiveAvatars avatarUrls={avatars} />
					<div className="flex items-center space-x-4">
						<Button
							className="flex items-center space-x-2"
							onClick={handleSave}
							size="icon"
							variant="ghost"
						>
							{isSaving ? (
								<>
									<CloudUpload />
									<span className="text-muted-foreground text-xs">
										Syncing...
									</span>
								</>
							) : (
								<CloudUpload />
							)}
						</Button>
						<Button onClick={handleAddToFavorite} size="icon" variant="ghost">
							<Star
								className={cn(
									isFavourite
										? "fill-yellow-500 text-yellow-500"
										: "text-muted-foreground"
								)}
							/>
						</Button>

						<Button size="icon" variant="ghost">
							<MoreHorizontal />
						</Button>
					</div>
				</div>
			}
		>
			<div
				className={cn(
					"mx-auto mt-10 w-full pb-[20vh] transition-all duration-300 ease-in-out",
					wideLayout ? "max-w-full px-24" : "max-w-[900px] px-12"
				)}
			>
				{/* Icon & Title Group */}
				<div className="group relative mb-8 flex flex-col">
					{/* Control Buttons: Added min-height to prevent layout jump when hidden */}
					<div
						className={cn(
							"flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
							showIcon ? "absolute top-4 left-32 z-20" : "mb-2 h-7"
						)}
					>
						{!showIcon && (
							<Button
								className="px-2 text-muted-foreground text-xs"
								onClick={() => setShowIcon(true)}
								size="sm"
								variant="outline"
							>
								<Smile className="mr-2 size-4" /> Add icon
							</Button>
						)}
					</div>

					{showIcon && (
						<div className="relative mb-4 w-fit text-7xl transition-all">
							<div className="select-none">⚱️</div>
							<Button
								className="absolute -top-3 -right-4 size-6 rounded-full border p-0 opacity-0 shadow-xl group-hover:opacity-100"
								onClick={() => setShowIcon(false)}
								size="icon"
								variant="ghost"
							>
								<X className="size-3" />
							</Button>
						</div>
					)}

					{/* Title: Removed absolute positioning so it stays in the flow */}
					<h1 className="font-bold text-[40px] leading-[1.2] tracking-tight outline-none">
						{knowledge.title}
					</h1>
				</div>
				{/* Properties Section */}
				<div className="mb-6 flex flex-col gap-0.5 text-sm">
					{/* Due Date */}
					<div className="group flex items-center rounded px-2 py-1 transition-colors hover:bg-white/5">
						<div className="flex w-32 items-center gap-2 text-[#737373]">
							<Calendar className="size-4" /> <span>Due Date</span>
						</div>
						<div className="font-medium text-[#EB5757]">
							November 17, 2025 11:30 AM <span className="ml-1">⏰</span>
						</div>
					</div>

					{/* Done Status */}
					<div className="group flex items-center rounded px-2 py-1 transition-colors hover:bg-white/5">
						<div className="flex w-32 items-center gap-2 text-[#737373]">
							<CheckSquare className="size-4" /> <span>Done</span>
						</div>
						<Checkbox className="border-white/20 data-[state=checked]:bg-blue-500" />
					</div>

					<button className="mt-1 w-fit rounded px-2 py-1 text-[#737373] transition-colors hover:bg-white/5 hover:text-foreground">
						+ Add a property
					</button>
				</div>

				{/* Comments Section */}
				<div className="mb-8 border-white/5 border-t pt-4">
					<div className="mb-4 flex items-center gap-2 text-[#737373]">
						<span className="font-semibold text-xs uppercase tracking-wider">
							Comments
						</span>
					</div>
					<div className="flex items-center gap-3">
						<Avatar className="size-7 border border-white/10">
							<AvatarImage alt={name} src={userAvatar} />
							<AvatarFallback
								className={cn("text-[10px]", `bg-${userColor}-600`)}
							>
								{name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<InputGroup className="border-none bg-muted-foreground/10 p-2 shadow-none focus-within:ring-0">
							<InputGroupInput
								className="border-none bg-transparent p-0 text-sm focus-visible:ring-0"
								placeholder="Add a comment..."
							/>
							<InputGroupButton onClick={handleSave}>
								<Send className="size-4 text-muted-foreground" />
							</InputGroupButton>
						</InputGroup>
					</div>
				</div>

				<Separator className="h-10" />

				{/* Editor Area */}
				<RichTextEditor
					className="mt-5"
					// collaborationOptions={collaborationOptions}
					initialContent={knowledge.content}
					onChange={handleOnChange}
					onSave={handleSave}
				/>
			</div>
		</MainContent>
	);
}

function DocumentSkeleton() {
	return <div className="h-screen w-full animate-pulse bg-[#191919]" />;
}
