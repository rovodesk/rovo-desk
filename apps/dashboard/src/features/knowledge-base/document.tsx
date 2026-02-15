import { useMutation } from "@tanstack/react-query";
import {
	type PartialBlock,
	RichTextEditor,
} from "@zero-heads-lab/design-system/components/editor";
import {
	Avatar,
	AvatarFallback,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Checkbox } from "@zero-heads-lab/design-system/components/ui/checkbox";
import {
	InputGroup,
	InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	Calendar,
	CheckSquare,
	ImageIcon,
	MoreHorizontal,
	Proportions,
	Smile,
	Star,
	X,
} from "lucide-react";
import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { avatars } from "@/data/active-avatars";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
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
	const [showBanner, setShowBanner] = useState(false);
	const [showIcon, setShowIcon] = useState(false);

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

	// Add to Favourite
	function handleAddToFavorite() {
		setIsFavourite((prev) => !prev);
		toast.success("Added to favorites");
	}

	if (isLoading) return <DocumentSkeleton />;

	return (
		<div className="flex min-h-screen flex-col bg-[#191919] text-[#E0E0E0] selection:bg-blue-500/30">
			{/* Header */}
			<Header className="sticky top-0 z-50 flex h-12 w-full items-center justify-between border-white/5 border-b bg-[#191919]/95 px-4 backdrop-blur-sm">
				{/* LEFT SIDE */}
				<div className="flex items-center gap-2">
					<Breadcrumbs />
				</div>

				{/* Active Avatars */}
				<div className="mx-auto hidden w-full max-w-md md:block">
					<ActiveAvatars avatarUrls={avatars} />
				</div>

				{/* Buttons */}
				<div className="flex items-center gap-1 border-white/10 border-l pl-3">
					<Button
						className="h-8 px-2 text-muted-foreground text-xs hover:bg-white/5 hover:text-foreground"
						onClick={handleSave}
						variant="ghost"
					>
						{isSaving ? "Syncing..." : "Save"}
					</Button>

					<Button
						className="size-8 text-muted-foreground hover:bg-white/5 hover:text-foreground"
						onClick={() => setWideLayout(!wideLayout)}
						size="icon"
						variant="ghost"
					>
						<Proportions className="size-4" />
					</Button>

					<Button
						className="size-8 text-muted-foreground hover:bg-white/5 hover:text-foreground"
						onClick={handleAddToFavorite}
						size="icon"
						variant="ghost"
					>
						<Star
							className={cn(
								"size-4",
								isFavourite && "fill-yellow-500 text-yellow-500"
							)}
						/>
					</Button>

					<Button
						className="size-8 text-muted-foreground hover:bg-white/5 hover:text-foreground"
						size="icon"
						variant="ghost"
					>
						<MoreHorizontal className="size-4" />
					</Button>
				</div>
			</Header>

			<MainContent className="flex flex-1 flex-col overflow-y-auto p-0" fixed>
				{/* Banner Section */}
				{showBanner && (
					<div className="group relative h-[25vh] w-full overflow-hidden">
						<div className="h-full w-full bg-linear-to-r from-blue-600 via-purple-500 to-red-500" />
						<Button
							className="absolute right-8 bottom-4 h-7 bg-black/30 text-white text-xs opacity-0 backdrop-blur-md transition-opacity hover:bg-black/50 group-hover:opacity-100"
							onClick={() => setShowBanner(false)}
							size="sm"
							variant="ghost"
						>
							Change cover
						</Button>
					</div>
				)}
				<div
					className={cn(
						"mx-auto w-full pb-[20vh] transition-all duration-300 ease-in-out",
						wideLayout ? "max-w-full px-24" : "max-w-[900px] px-12",
						/* Dynamic padding: If there's a banner, we need less top padding inside the container */
						showBanner ? "pt-12" : "pt-24"
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
							{!showBanner && (
								<Button
									className="px-2 text-muted-foreground text-xs"
									onClick={() => setShowBanner(true)}
									size="sm"
									variant="outline"
								>
									<ImageIcon className="mr-2 size-4" /> Add cover
								</Button>
							)}
						</div>

						{/* Page Icon: Offset logic for when it sits on the banner line */}
						{showIcon && (
							<div
								className={cn(
									"relative mb-4 w-fit text-7xl transition-all",
									showBanner
										? "-mt-24 rounded-xl bg-[#191919] p-3 shadow-lg" // Pops over the banner
										: ""
								)}
							>
								<div className="select-none">⚱️</div>
								<Button
									className="absolute -top-3 -right-4 size-6 rounded-full border border-white/10 bg-[#333] p-0 opacity-0 shadow-xl hover:bg-[#444] group-hover:opacity-100"
									onClick={() => setShowIcon(false)}
								>
									<X className="size-3" />
								</Button>
							</div>
						)}

						{/* Title: Removed absolute positioning so it stays in the flow */}
						<h1 className="font-bold text-[40px] text-white leading-[1.2] tracking-tight outline-none">
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
								<AvatarFallback className="bg-orange-600 text-[10px]">
									D
								</AvatarFallback>
							</Avatar>
							<InputGroup className="border-none bg-transparent shadow-none focus-within:ring-0">
								<InputGroupInput
									className="border-none bg-transparent p-0 text-sm focus-visible:ring-0"
									placeholder="Add a comment..."
								/>
							</InputGroup>
						</div>
					</div>

					{/* Editor Area */}
					<RichTextEditor
						className="notion-editor min-h-[300px]"
						initialContent={knowledge.content}
						onChange={(v) => update.mutate({ content: v })}
						onSave={handleSave}
					/>
				</div>
			</MainContent>
		</div>
	);
}

function DocumentSkeleton() {
	return <div className="h-screen w-full animate-pulse bg-[#191919]" />;
}
