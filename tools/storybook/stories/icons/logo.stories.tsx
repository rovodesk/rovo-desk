import type { Meta, StoryObj } from "@storybook/react";
import { Logo, LogoIcon } from "@zero-heads-lab/design-system/components/logo";

/**
 * The brand identity components for Zero Heads.
 * Includes the full brand mark and the simplified icon for tight spaces.
 */
const meta = {
	title: "icons/Logo",
	component: Logo,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		className: {
			control: "text",
			description: "Tailwind classes for sizing and coloring",
		},
		title: {
			control: "text",
			description: "Accessible title for SVG",
		},
	},
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof Logo>;

/**
 * The standard brand logo used in headers and hero sections.
 */
export const Default: Story = {
	args: {
		className: "w-32 h-auto text-foreground",
		title: "Zero Heads Lab",
	},
};

/**
 * The simplified icon variant for navbars, buttons, or mobile views.
 */
export const Icon: StoryObj<typeof LogoIcon> = {
	render: (args) => <LogoIcon {...args} />,
	args: {
		className: "w-10 h-10 text-primary",
		title: "ZH Icon",
	},
};

/**
 * Demonstration of the "fill-current" behavior using brand colors.
 */
export const CustomColor: Story = {
	render: () => (
		<div className="flex items-center gap-8">
			<Logo className="h-auto w-24 text-blue-600" />
			<LogoIcon className="h-12 w-12 text-orange-500" />
			<Logo className="h-auto w-24 text-emerald-500" />
		</div>
	),
};

/**
 * Usage within a dark-mode context (ensure your wrapper supports this).
 */
export const Inverted: Story = {
	parameters: {
		backgrounds: { default: "dark" },
	},
	args: {
		className: "w-32 h-auto text-white",
	},
};
