import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Textarea } from "@zero-heads-lab/design-system/components/ui/textarea";
import { Placeholder } from "@zero-heads-lab/shared/utils";
import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";

const ConversationInput = () => {
	const { data: user } = useUser();
	const [message, setMessage] = useState("");

	const userImage = user?.picture;

	const handleSend = () => {
		if (!message.trim()) return;

		console.log("send message", message);
		setMessage("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex items-center gap-2">
			{/* Avatar */}
			<Avatar className="h-8 w-8 shrink-0">
				<AvatarImage src={userImage} />
				<AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
					{Placeholder.avatar(user?.email)}
				</AvatarFallback>
			</Avatar>

			{/* Input Area */}
			<div className="flex flex-1 items-end gap-2 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-ring">
				<Textarea
					className="min-h-[36px] resize-none border-0 bg-transparent p-2 text-sm shadow-none focus-visible:ring-0"
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Type a message…"
					value={message}
				/>

				<div className="flex items-center gap-1 pb-0.5">
					<Button className="h-8 w-8" size="icon" variant="ghost">
						<Smile className="h-4 w-4 text-muted-foreground" />
					</Button>

					<Button className="h-8 w-8" size="icon" variant="ghost">
						<Paperclip className="h-4 w-4 text-muted-foreground" />
					</Button>

					<Button
						className="h-8 w-8"
						disabled={!message.trim()}
						onClick={handleSend}
						size="icon"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConversationInput;
