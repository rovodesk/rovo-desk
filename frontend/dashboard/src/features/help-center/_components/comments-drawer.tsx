import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@zero-heads-lab/design-system/components/ui/drawer";
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { Textarea } from "@zero-heads-lab/design-system/components/ui/textarea";
import { generateCUID } from "@zero-heads-lab/shared/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { avatars } from "@/data/active-avatars";
import { ActiveAvatars } from "./active-avatars";

type Comment = {
	id: string;
	author: string;
	avatar?: string;
	content: string;
	createdAt: Date;
};

const mockComments: Comment[] = [
	{
		id: "1",
		author: "Sarah Chen",
		content: "This looks great! We should ship this in the next release.",
		createdAt: new Date(Date.now() - 1000 * 60 * 12),
	},
	{
		id: "2",
		author: "Alex Johnson",
		content: "Can we improve spacing in the header section?",
		createdAt: new Date(Date.now() - 1000 * 60 * 45),
	},
];

const CommentsDrawer = () => {
	const [comments, setComments] = useState<Comment[]>(mockComments);
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = () => {
		if (!message.trim()) return;

		setIsSubmitting(true);

		const newComment: Comment = {
			id: generateCUID(),
			author: "You",
			content: message,
			createdAt: new Date(),
		};

		// 🔌 Replace with real API call
		setTimeout(() => {
			setComments((prev) => [newComment, ...prev]);
			setMessage("");
			setIsSubmitting(false);
		}, 500);
	};

	return (
		<Drawer direction="right">
			<DrawerTrigger asChild>
				<Button
					className="relative h-9 shadow-xs"
					size="icon"
					variant="outline"
				>
					<MessageCircle className="size-4" />
					{comments.length > 0 && (
						<span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 font-medium text-[10px] text-primary-foreground">
							{comments.length}
						</span>
					)}
				</Button>
			</DrawerTrigger>

			<DrawerContent className="flex w-[420px] flex-col p-0">
				{/* Header */}
				<DrawerHeader className="border-b px-6 py-4">
					<DrawerTitle className="flex items-center justify-between font-semibold text-base">
						Comments ({comments.length})
						<ActiveAvatars avatarUrls={avatars} />
					</DrawerTitle>
					<DrawerClose />
				</DrawerHeader>

				{/* Comments List */}
				<ScrollArea className="flex-1 px-6 py-4">
					{comments.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
							<MessageCircle className="mb-3 size-8 opacity-40" />
							<p className="font-medium text-sm">No comments yet</p>
							<p className="text-xs">
								Start the conversation by adding a comment.
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{comments.map((comment) => (
								<div className="flex gap-3" key={comment.id}>
									<Avatar className="size-8">
										<AvatarImage src={comment.avatar} />
										<AvatarFallback>
											{comment.author.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 space-y-1">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">
												{comment.author}
											</span>
											<span className="text-muted-foreground text-xs">
												{formatDistanceToNow(comment.createdAt, {
													addSuffix: true,
												})}
											</span>
										</div>

										<p className="text-muted-foreground text-sm leading-relaxed">
											{comment.content}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</ScrollArea>

				<Separator />

				{/* Input Area */}
				<DrawerFooter className="sticky bottom-0 bg-background px-6 py-4">
					<div className="flex gap-2">
						<Textarea
							className="min-h-[44px] resize-none"
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Write a comment..."
							value={message}
						/>
						<Button
							disabled={isSubmitting || !message.trim()}
							onClick={handleSubmit}
							size="icon"
						>
							<Send className="size-4" />
						</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default CommentsDrawer;
