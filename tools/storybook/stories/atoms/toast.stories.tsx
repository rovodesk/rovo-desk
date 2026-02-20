import type { Meta, StoryObj } from "@storybook/react";
import {
	Toaster,
	toast,
} from "@zero-heads-lab/design-system/components/ui/toast";
import { action } from "storybook/actions";

/**
 * An opinionated toast component for React.
 */
const meta: Meta<typeof Toaster> = {
	title: "atoms/Toast",
	component: Toaster,
	tags: ["autodocs"],
	argTypes: {},
	args: {
		position: "bottom-right",
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the toaster.
 */
export const Default: Story = {
	render: (args) => (
		<div className="flex min-h-96 items-center justify-center space-x-2">
			<button
				onClick={() =>
					toast("Event has been created", {
						description: new Date().toDateString(),
						action: {
							label: "Undo",
							onClick: action("Undo clicked"),
						},
					})
				}
				type="button"
			>
				Show Toast
			</button>
			<Toaster {...args} />
		</div>
	),
};
