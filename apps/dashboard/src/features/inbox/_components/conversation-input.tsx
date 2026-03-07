import { useUser } from "@zero-heads-lab/auth/hooks";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";

const ConversationInput = () => {
	const { user } = useUser();
	return (
		<div className="border-border border-t px-5 py-3">
			<div className="flex items-center gap-2">
				<Avatar className="h-7 w-7 shrink-0">
					<AvatarImage src={user!.image!} />
					<AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
						{user!.name!.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="relative flex-1">
					<Input
						className="h-10 pr-20 text-sm"
						placeholder="Type your comment..."
					/>
					<div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-0.5">
						<Button className="h-7 w-7" size="icon" variant="ghost">
							<Smile className="h-4 w-4 text-muted-foreground" />
						</Button>
						<Button className="h-7 w-7" size="icon" variant="ghost">
							<Paperclip className="h-4 w-4 text-muted-foreground" />
						</Button>
						<Button
							className="h-7 w-7 bg-primary text-primary-foreground"
							size="icon"
						>
							<Send className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConversationInput;
