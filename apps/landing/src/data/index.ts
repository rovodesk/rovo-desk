import type { Page } from "@/lib/componen-registry/types";

export const data: { pages: Page[] } = {
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
};
