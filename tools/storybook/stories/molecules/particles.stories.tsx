import type { Meta, StoryObj } from "@storybook/react";
import { Particles } from "@zero-heads-lab/design-system/components/particles";

/**
 * An interactive canvas-based particle system.
 */
const meta = {
	title: "molecules/Particles",
	component: Particles,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	// This decorator ensures the container always fills the Storybook preview area
	decorators: [
		(Story) => (
			<div className="h-screen w-full overflow-hidden">
				<Story />
			</div>
		),
	],
	argTypes: {
		color: { control: "color" },
		quantity: { control: { type: "range", min: 10, max: 1000, step: 10 } },
		staticity: { control: { type: "range", min: 1, max: 100 } },
		ease: { control: { type: "range", min: 1, max: 100 } },
		size: { control: { type: "number" } },
	},
} satisfies Meta<typeof Particles>;

export default meta;

type Story = StoryObj<typeof Particles>;

export const Default: Story = {
	render: (args) => (
		<div className="relative h-full w-full bg-slate-950">
			<Particles {...args} className="absolute inset-0" />
			<div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
				<h1 className="font-bold text-6xl tracking-tighter">Zero Heads Lab</h1>
				<p className="mt-4 text-slate-400">Move your mouse to interact</p>
			</div>
		</div>
	),
	args: {
		quantity: 100,
		color: "#ffffff",
		ease: 50,
	},
};

export const HighDensity: Story = {
	render: (args) => (
		<div className="relative h-full w-full bg-black">
			<Particles {...args} className="absolute inset-0" />
		</div>
	),
	args: {
		quantity: 500,
		staticity: 30,
		ease: 20,
		color: "#fbbf24",
		size: 0.6,
	},
};

export const WindEffect: Story = {
	render: (args) => (
		<div className="relative h-full w-full bg-zinc-900">
			<Particles {...args} className="absolute inset-0" />
		</div>
	),
	args: {
		quantity: 200,
		vx: 0.5,
		vy: -0.2,
		color: "#60a5fa",
	},
};

/**
 * Note: We override the decorator's height here for the card demo
 */
export const InsideCard: Story = {
	decorators: [
		(Story) => (
			<div className="flex h-screen w-full items-center justify-center bg-slate-100">
				<Story />
			</div>
		),
	],
	render: (args) => (
		<div className="relative h-64 w-96 overflow-hidden rounded-xl bg-slate-900 shadow-2xl">
			<Particles {...args} className="absolute inset-0" />
			<div className="relative z-10 p-8 text-white">
				<h3 className="font-semibold text-xl">Interactive Card</h3>
				<p className="mt-2 text-slate-400 text-sm">
					Constrained to the parent container's bounds.
				</p>
			</div>
		</div>
	),
	args: {
		quantity: 80,
		color: "#ffffff",
	},
};
