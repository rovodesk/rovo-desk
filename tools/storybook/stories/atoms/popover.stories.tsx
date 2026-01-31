import type { Meta, StoryObj } from "@storybook/react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@zero-heads-lab/design-system/components/ui/popover";

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta = {
	title: "atoms/Popover",
	component: Popover,
	tags: ["autodocs"],
	argTypes: {},

	render: (args) => (
		<Popover {...args}>
			<PopoverTrigger>Open</PopoverTrigger>
			<PopoverContent>Place content for the popover here.</PopoverContent>
		</Popover>
	),
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the popover.
 */
export const Default: Story = {};
