import {
	IconBrandDiscord,
	IconBrandLinkedin,
	IconBrandTwitter,
	IconBrandYoutube,
	type IconProps,
} from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type Social = {
	name: string;
	icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
	href: string;
	hoverClass: string;
};

export const Socials: Social[] = [
	{
		name: "Discord",
		icon: IconBrandDiscord,
		href: "https://discord.gg/yourlink",
		hoverClass:
			"hover:border-[#5865F2] hover:text-[#5865F2] hover:bg-[#5865F2]/5",
	},
	{
		name: "Twitter",
		icon: IconBrandTwitter,
		href: "https://x.com/yourlink",
		hoverClass:
			"hover:border-black dark:hover:border-white hover:bg-foreground/5",
	},
	{
		name: "YouTube",
		icon: IconBrandYoutube,
		href: "https://youtube.com/yourlink",
		hoverClass:
			"hover:border-[#FF0000] hover:text-[#FF0000] hover:bg-[#FF0000]/5",
	},
	{
		name: "LinkedIn",
		icon: IconBrandLinkedin,
		href: "https://linkedin.com/company/yourlink",
		hoverClass:
			"hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/5",
	},
];
