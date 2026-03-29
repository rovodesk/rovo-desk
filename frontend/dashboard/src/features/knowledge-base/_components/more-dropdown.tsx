import { IconCategoryFilled } from "@tabler/icons-react";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@zero-heads-lab/design-system/components/ui/dropdown-menu";
import {
	ArchiveIcon,
	Clock10,
	MoreVerticalIcon,
	PencilIcon,
	Share2,
	TagIcon,
} from "lucide-react";

export const MoreDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="ml-auto h-9 w-9 text-muted-foreground hover:text-foreground"
					size="icon"
					variant="ghost"
				>
					<MoreVerticalIcon />
					<span className="sr-only">More</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-40">
				<DropdownMenuGroup className="space-y-1">
					<DropdownMenuItem>
						<TagIcon className="mr-2 h-4 w-4 group-hover:text-foreground" />
						Add Tags
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconCategoryFilled className="mr-2 h-4 w-4 group-hover:text-foreground" />
						Add to Category
					</DropdownMenuItem>
					<DropdownMenuItem className="group hover:bg-red-50 group-hover:text-red-500">
						<ArchiveIcon className="mr-2 h-4 w-4 group-hover:text-foreground" />
						Archive
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Clock10 className="mr-2 h-4 w-4 group-hover:text-foreground" />
						Schedule to publish
					</DropdownMenuItem>
					<DropdownMenuItem>
						<PencilIcon className="mr-2 h-4 w-4 group-hover:text-foreground" />
						Save as Draft
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Share2 className="mr-2 h-4 w-4 group-hover:text-foreground" />
						Share
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MoreDropdown;
