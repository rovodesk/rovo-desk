import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { FileIcon, Package2Icon } from "lucide-react";

// fill this with your actual GitHub info
export const gitConfig = {
	user: "zero-heads-lab",
	repo: "zero-heads",
	branch: "main",
};

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Zero Heads Developers",
		},
		links: [
			{
				icon: <Package2Icon />,
				text: "Installation",
				url: "/installation",
			},
			{
				icon: <FileIcon />,
				text: "Documentaion",
				url: "/docs",
			},
			{
				icon: <FileIcon />,
				text: "UI Components",
				url: "/components",
			},
			{
				icon: <FileIcon />,
				text: "API Reference",
				url: "/api",
			},
			{
				icon: <FileIcon />,
				text: "Guides",
				url: "/guides",
			},
		],
		themeSwitch: {
			enabled: true,
			component: <ThemeSwitch />,
			mode: "light-dark-system",
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	};
}
