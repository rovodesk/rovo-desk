import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@zero-heads-lab/design-system/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "@zero-heads-lab/design-system/components/ui/field";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import {
	RadioGroup,
	RadioGroupItem,
} from "@zero-heads-lab/design-system/components/ui/radio-group";

const meta: Meta<typeof Field> = {
	title: "molecules/Field",
	component: Field,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof Field>;

/* -------------------------------------------------------------------------- */
/*                               Basic field                                  */
/* -------------------------------------------------------------------------- */

export const Vertical: Story = {
	render: () => (
		<Field>
			<FieldLabel htmlFor="email">Email</FieldLabel>
			<FieldContent>
				<Input id="email" placeholder="you@example.com" />
				<FieldDescription>
					We’ll never share your email address.
				</FieldDescription>
			</FieldContent>
		</Field>
	),
};

/* -------------------------------------------------------------------------- */
/*                              Horizontal field                               */
/* -------------------------------------------------------------------------- */

export const Horizontal: Story = {
	render: () => (
		<Field orientation="horizontal">
			<FieldLabel htmlFor="username">Username</FieldLabel>
			<FieldContent>
				<Input id="username" placeholder="username" />
				<FieldDescription>
					This will be visible to other users.
				</FieldDescription>
			</FieldContent>
		</Field>
	),
};

/* -------------------------------------------------------------------------- */
/*                              Responsive field                               */
/* -------------------------------------------------------------------------- */

export const Responsive: Story = {
	render: () => (
		<FieldGroup>
			<Field orientation="responsive">
				<FieldLabel htmlFor="firstName">First name</FieldLabel>
				<FieldContent>
					<Input id="firstName" />
				</FieldContent>
			</Field>

			<Field orientation="responsive">
				<FieldLabel htmlFor="lastName">Last name</FieldLabel>
				<FieldContent>
					<Input id="lastName" />
				</FieldContent>
			</Field>
		</FieldGroup>
	),
};

/* -------------------------------------------------------------------------- */
/*                               With errors                                   */
/* -------------------------------------------------------------------------- */

export const WithError: Story = {
	render: () => (
		<Field data-invalid="true">
			<FieldLabel htmlFor="password">Password</FieldLabel>
			<FieldContent>
				<Input id="password" type="password" />
				<FieldError
					errors={[
						{ message: "Password is required." },
						{ message: "Password must be at least 8 characters." },
					]}
				/>
			</FieldContent>
		</Field>
	),
};

/* -------------------------------------------------------------------------- */
/*                               Field set                                     */
/* -------------------------------------------------------------------------- */

export const FieldSetExample: Story = {
	render: () => (
		<FieldSet>
			<FieldLegend>Notifications</FieldLegend>

			<Field>
				<FieldLabel>
					<Checkbox />
					<FieldTitle>Email notifications</FieldTitle>
				</FieldLabel>
				<FieldDescription>Receive updates via email.</FieldDescription>
			</Field>

			<FieldSeparator>or</FieldSeparator>

			<Field>
				<FieldLabel>
					<Checkbox />
					<FieldTitle>SMS notifications</FieldTitle>
				</FieldLabel>
				<FieldDescription>Receive updates via text message.</FieldDescription>
			</Field>
		</FieldSet>
	),
};

/* -------------------------------------------------------------------------- */
/*                             Radio group example                              */
/* -------------------------------------------------------------------------- */

export const RadioGroupExample: Story = {
	render: () => (
		<FieldSet>
			<FieldLegend variant="legend">Plan</FieldLegend>

			<RadioGroup defaultValue="basic">
				<Field>
					<FieldLabel>
						<RadioGroupItem value="basic" />
						<FieldTitle>Basic</FieldTitle>
					</FieldLabel>
					<FieldDescription>For personal use.</FieldDescription>
				</Field>

				<Field>
					<FieldLabel>
						<RadioGroupItem value="pro" />
						<FieldTitle>Pro</FieldTitle>
					</FieldLabel>
					<FieldDescription>For teams and professionals.</FieldDescription>
				</Field>
			</RadioGroup>
		</FieldSet>
	),
};
