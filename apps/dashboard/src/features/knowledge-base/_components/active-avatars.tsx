import { Link } from "@tanstack/react-router";
import { cn } from "@zero-heads-lab/design-system/lib/utils";

interface Avatar {
	imageUrl: string;
	profileUrl: string;
}
interface AvatarCirclesProps {
	className?: string;
	numPeople?: number;
	avatarUrls: Avatar[];
}

export const ActiveAvatars = ({
	numPeople,
	className,
	avatarUrls,
}: AvatarCirclesProps) => {
	return (
		<div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
			{avatarUrls.map((url, index) => (
				<a
					href={url.profileUrl}
					key={index}
					rel="noopener noreferrer"
					target="_blank"
				>
					<img
						alt={`Avatar ${index + 1}`}
						className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
						height={40}
						key={index}
						src={url.imageUrl}
						width={40}
					/>
				</a>
			))}
			{(numPeople ?? 0) > 0 && (
				<Link
					className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center font-medium text-white text-xs hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
					to="/"
				>
					+{numPeople}
				</Link>
			)}
		</div>
	);
};
