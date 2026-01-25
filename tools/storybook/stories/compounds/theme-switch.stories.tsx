import type { Meta, StoryObj } from "@storybook/react";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { ThemeProvider } from "@zero-heads-lab/design-system/context/theme";

const meta: Meta<typeof ThemeSwitch> = {
	title: "Components/ThemeSwitch",
	component: ThemeSwitch,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<ThemeProvider defaultTheme="system" storageKey="sb-ui-theme">
				<div className="flex min-h-[100px] items-center justify-center bg-background p-8">
					<Story />
				</div>
			</ThemeProvider>
		),
	],
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof ThemeSwitch>;

/**
 * The default state of the switch.
 * Note: The View Transition effect requires a browser that supports `document.startViewTransition`.
 */
export const Default: Story = {
	args: {
		className: "",
	},
};

/**
 * Demonstration of how the switch looks when given additional styling via `cn`.
 */
export const LargeCustom: Story = {
	args: {
		className: "scale-150 border border-muted",
	},
};
