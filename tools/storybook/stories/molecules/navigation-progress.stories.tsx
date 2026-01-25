import type { Meta, StoryObj } from "@storybook/react";
import { NavigationProgress } from "@zero-heads-lab/design-system/components/navigation-progress";
import { useState } from "react";

/**
 * A top-loading progress bar that indicates navigation or background transitions.
 * Wraps `react-top-loading-bar` and responds to the `isNavigating` prop.
 */
const meta = {
	title: "molecules/NavigationProgress",
	component: NavigationProgress,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: "Note: This bar appears at the very top of the viewport.",
			},
		},
	},
} satisfies Meta<typeof NavigationProgress>;

export default meta;

type Story = StoryObj<typeof NavigationProgress>;

/**
 * Use the 'isNavigating' control below to start or complete the bar.
 */
export const Controlled: Story = {
	args: {
		isNavigating: true,
	},
};

/**
 * A simulation of a 3-second page load.
 */
export const SimulatedLoad: Story = {
	render: () => {
		const [loading, setLoading] = useState(false);

		const triggerLoad = () => {
			setLoading(true);
			setTimeout(() => setLoading(false), 3000);
		};

		return (
			<div className="flex flex-col items-center gap-4 p-20">
				<NavigationProgress isNavigating={loading} />
				<p className="text-muted-foreground text-sm">
					{loading ? "Navigating..." : "Idle"}
				</p>
				<button
					className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
					disabled={loading}
					onClick={triggerLoad}
				>
					Simulate 3s Navigation
				</button>
			</div>
		);
	},
};

/**
 * Shows how the bar looks against a dark background or specific theme.
 */
export const OnDarkBackground: Story = {
	parameters: {
		backgrounds: { default: "dark" },
	},
	args: {
		isNavigating: true,
	},
};
