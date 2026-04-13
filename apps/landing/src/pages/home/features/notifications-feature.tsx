import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { Placeholder } from "@zero-heads-lab/shared/lib/utils";
import { AnimatedList } from "@/components/animated-list";

interface Item {
	name: string;
	email: string;
	avatar: string;
	time: string;
}

let notifications = [
	{
		name: "Payment received",
		email: "user@okta.com",
		time: "15m ago",
		avatar: Placeholder.avatar("user@okta.com"),
	},
	{
		name: "User signed up",
		email: "user@uber.com",
		time: "10m ago",
		avatar: Placeholder.avatar("user@uber.com"),
	},
	{
		name: "Orders are delayed",
		email: "user@myntra.com",
		time: "5m ago",
		avatar: Placeholder.avatar("user@myntra.com"),
	},
	{
		name: "New comment on your post",
		email: "user@flipkart.com",
		time: "2m ago",
		avatar: Placeholder.avatar("user@flipkart.com"),
	},
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, email, avatar, time }: Item) => {
	return (
		<figure
			className={cn(
				"relative mx-auto min-h-fit w-full max-w-100 cursor-pointer overflow-hidden rounded-2xl p-4",
				// animation styles
				"transition-all duration-200 ease-in-out hover:scale-[103%]",
				// light styles
				"bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
				// dark styles
				"transform-gpu dark:bg-background dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
			)}
		>
			<div className="flex flex-row items-center gap-3">
				<Avatar>
					<AvatarImage alt={name} src={avatar} />
					<AvatarFallback>{name[0]}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col overflow-hidden">
					<figcaption className="flex flex-row items-center whitespace-pre font-medium text-lg dark:text-white">
						<span className="text-sm sm:text-lg">{name}</span>
						<span className="mx-1">·</span>
						<span className="text-neutral-500 text-xs">{time}</span>
					</figcaption>
					<p className="font-normal text-sm dark:text-white/60">{email}</p>
				</div>
			</div>
		</figure>
	);
};

export function NotificationsFeature({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"relative flex h-[380px] w-full flex-col overflow-hidden rounded-2xl p-2",
				className
			)}
		>
			<AnimatedList
				columnGap={96}
				formationDuration={1.4}
				scrollDownDuration={8}
			>
				{notifications.map((item, idx) => (
					<Notification {...item} key={idx} />
				))}
			</AnimatedList>

			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
		</div>
	);
}
