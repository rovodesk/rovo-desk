import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// fill this with your actual GitHub info
export const gitConfig = {
	user: "zero-heads-lab",
	repo: "zero-heads",
	branch: "main",
};

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: "Zero Heads Docs",
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	};
}
