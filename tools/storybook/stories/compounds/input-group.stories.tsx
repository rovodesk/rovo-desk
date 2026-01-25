import type { Meta, StoryObj } from "@storybook/react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { Check, Mail, Search, Send } from "lucide-react";

const meta: Meta<typeof InputGroup> = {
	title: "Components/InputGroup",
	component: InputGroup,
	tags: ["autodocs"],
	argTypes: {
		className: { control: "text" },
	},
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

/**
 * Standard search bar style with an icon at the start.
 */
export const WithLeadingIcon: Story = {
	render: (args) => (
		<InputGroup {...args}>
			<InputGroupAddon align="inline-start">
				<Search />
			</InputGroupAddon>
			<InputGroupInput placeholder="Search projects..." />
		</InputGroup>
	),
};

/**
 * Common for keyboard shortcuts or field hints.
 */
export const WithTrailingKbd: Story = {
	render: (args) => (
		<InputGroup {...args}>
			<InputGroupInput placeholder="Quick open..." />
			<InputGroupAddon align="inline-end">
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>
			</InputGroupAddon>
		</InputGroup>
	),
};

/**
 * Using the InputGroupButton for actions inside the input field.
 */
export const WithActionButtons: Story = {
	render: (args) => (
		<InputGroup {...args}>
			<InputGroupAddon align="inline-start">
				<Mail className="text-muted-foreground" />
			</InputGroupAddon>
			<InputGroupInput placeholder="Enter email" />
			<InputGroupAddon align="inline-end">
				<InputGroupButton variant="default">Subscribe</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	),
};

/**
 * Demonstrates the 'block' alignment which stacks the addon (useful for labels or errors).
 */
export const StackedLayout: Story = {
	render: (args) => (
		<InputGroup {...args} className="max-w-sm">
			<InputGroupAddon align="block-start" className="border-b bg-muted/50">
				<InputGroupText>Protocol</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput defaultValue="https://github.com" />
		</InputGroup>
	),
};

/**
 * Works seamlessly with Textarea for multi-line input groups.
 */
export const WithTextarea: Story = {
	render: (args) => (
		<InputGroup {...args} className="max-w-md">
			<InputGroupTextarea
				className="min-h-[100px]"
				placeholder="Type your message..."
			/>
			<InputGroupAddon
				align="block-end"
				className="justify-end border-t bg-muted/20"
			>
				<InputGroupButton size="icon-xs" variant="ghost">
					<Check className="size-4" />
				</InputGroupButton>
				<InputGroupButton size="xs" variant="default">
					<Send className="mr-2 size-3" />
					Send
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	),
};

/**
 * Shows the error state (aria-invalid) which triggers the red ring/border styles.
 */
export const InvalidState: Story = {
	render: (args) => (
		<InputGroup {...args} aria-invalid="true">
			<InputGroupInput placeholder="Invalid input..." />
			<InputGroupAddon align="inline-end">
				<span className="text-destructive text-xs">Required</span>
			</InputGroupAddon>
		</InputGroup>
	),
};
