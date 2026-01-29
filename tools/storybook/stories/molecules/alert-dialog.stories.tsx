import type { Meta, StoryObj } from "@storybook/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@zero-heads-lab/design-system/components/ui/alert-dialog";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Info, Trash2 } from "lucide-react";

const meta = {
	title: "molecules/AlertDialog",
	component: AlertDialog,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof AlertDialog>;

export default meta;

/**
 * Standard destructive alert. Shows the "default" size which
 * transitions to a left-aligned layout when media is present on larger screens.
 */
export const Destructive: StoryObj = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Delete Project</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<Trash2 />
					</AlertDialogMedia>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your
						project and remove all associated data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * Small variant. Often used for simple confirmations.
 * Note the grid-cols-2 layout in the footer.
 */
export const SmallConfirmation: StoryObj = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Sign Out</Button>
			</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia>
						<Info className="text-muted-foreground" />
					</AlertDialogMedia>
					<AlertDialogTitle>Ready to leave?</AlertDialogTitle>
					<AlertDialogDescription>
						You will need to log back in to access your dashboard.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Stay</AlertDialogCancel>
					<AlertDialogAction>Logout</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};

/**
 * A warning style alert without media, showing the centered text default.
 */
export const Warning: StoryObj = {
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="secondary">Publish Changes</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Push to Production?</AlertDialogTitle>
					<AlertDialogDescription>
						This will make your changes live to all users. Make sure you've
						verified the <a href="/">deployment checklist</a>.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Review</AlertDialogCancel>
					<AlertDialogAction className="bg-amber-600 hover:bg-amber-700">
						Publish Now
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
};
