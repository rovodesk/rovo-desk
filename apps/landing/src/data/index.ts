import type { Page } from "@/lib/componen-registry/types";

export const data: { pages: Page[] } = {
<<<<<<< HEAD
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
=======
    pages: [
        {
            id: "69af1b12498f4b89420be784",
            title: "Home",
            slug: "home",
            sections: [
                {
                    id: "section1",
                    blockType: "hero",
                    background: {
                        image: {
                            url: "path/to/hero-background.jpg",
                            alt: "Hero Background Image",
                        },
                    },
                    headline: {
                        prefixText: "Welcome to",
                        highlightText: "Our Product",
                        baseText: "The best solution for your needs.",
                        accentText: "Get Started Today!",
                    },
                    subHeadline: {
                        text: "Join thousands of satisfied customers.",
                        enabled: true,
                    },
                    ctas: [
                        {
                            label: "Sign Up",
                            link: "/signup",
                        },
                        {
                            label: "Learn More",
                            link: "/learn-more",
                        },
                    ],
                },
                {
                    id: "section2",
                    blockType: "problem",
                    // ... other properties for problem section
                },
                {
                    id: "section3",
                    blockType: "features",
                    // ... other properties for features section
                },
                {
                    id: "section4",
                    blockType: "comingSoon",
                    // ... other properties for coming soon section
                },
            ],
        },
    ],
>>>>>>> 8b8c11c (feat: Add animated components and cursor trail for enhanced UI experience)
};
