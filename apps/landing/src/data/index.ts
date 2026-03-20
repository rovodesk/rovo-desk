import type { Page } from "@/lib/componen-registry/types";

export const data: { pages: Page[] } = {
	pages: [
		{
			id: "69af1b12498f4b89420be784",
			title: "Home",
			slug: "home",
			sections: [
				{
					id: "hero-section",
					blockType: "hero",
					background: {
						image: {
							url: "/background.jpg",
							alt: "Hero Background Image",
						},
					},
					headline: {
						prefixText: "The",
						highlightText: "AI-Powered",
						baseText: "Helpdesk & CRM for the AI-First Era",
						accentText: "Get Started Today!",
					},
					subHeadline: {
						text: "Replace your CRM and helpdesk stack with only one AI tool to handle all for . you so you can chill and grab a beer",
						enabled: true,
					},
					ctas: [
						{
							type: "primary",
							label: "Get Started for Free",
							link: "/signup",
						},
						{
							type: "secondary",
							label: "Book a Demo",
							link: "/learn-more",
						},
					],
				},
				{
					id: "problem-section",
					blockType: "problem",
					title: "Everything you need to scale faster",
					description:
						"Explore the features that make RovoDesk the perfect choice for your business.",
				},
				{
					id: "features-section",
					blockType: "features",
					// ... other properties for features section
				},
			],
		},
	],
};
