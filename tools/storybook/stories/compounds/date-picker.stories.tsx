import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@zero-heads-lab/design-system/components/date-picker";
import { useState } from "react";

const meta: Meta<typeof DatePicker> = {
	title: "compounds/DatePicker",
	component: DatePicker,
	argTypes: {
		onSelect: { action: "date selected" },
		placeholder: {
			control: "text",
			defaultValue: "Pick a date",
		},
	},
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

/**
 * Default controlled DatePicker
 */
export const Default: Story = {
	render: (args) => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<DatePicker
				{...args}
				onSelect={(d) => {
					setDate(d);
					args.onSelect?.(d);
				}}
				selected={date}
			/>
		);
	},
};

/**
 * Preselected date
 */
export const WithPreselectedDate: Story = {
	render: (args) => {
		const [date, setDate] = useState<Date | undefined>(new Date(2024, 0, 15));

		return (
			<DatePicker
				{...args}
				onSelect={(d) => {
					setDate(d);
					args.onSelect?.(d);
				}}
				selected={date}
			/>
		);
	},
};

/**
 * Custom placeholder
 */
export const CustomPlaceholder: Story = {
	args: {
		placeholder: "Select your birth date",
	},
	render: (args) => {
		const [date, setDate] = useState<Date | undefined>();

		return (
			<DatePicker
				{...args}
				onSelect={(d) => {
					setDate(d);
					args.onSelect?.(d);
				}}
				selected={date}
			/>
		);
	},
};
