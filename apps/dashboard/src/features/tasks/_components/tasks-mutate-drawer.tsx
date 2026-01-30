import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@zero-heads-lab/design-system/components/ui/sheet";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { z } from "zod";
import type { Task } from "../data/types";

type TaskMutateDrawerProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	currentRow?: Task;
};

const formSchema = z.object({
	title: z.string().min(1, "Title is required."),
	status: z.string().min(1, "Please select a status."),
	label: z.string().min(1, "Please select a label."),
	priority: z.string().min(1, "Please choose a priority."),
});

export function TasksMutateDrawer({
	open,
	onOpenChange,
	currentRow,
}: TaskMutateDrawerProps) {
	const isUpdate = !!currentRow;

	const form = useAppForm({
		defaultValues: currentRow ?? {
			title: "",
			status: "",
			label: "",
			priority: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			// do something with the form data
			onOpenChange(false);
			form.reset();
			toast.success("Task created successfully", {
				description: (
					<pre className="text-xs">{JSON.stringify(value, null, 2)}</pre>
				),
			});
		},
	});

	return (
		<Sheet
			onOpenChange={(v) => {
				onOpenChange(v);
				form.reset();
			}}
			open={open}
		>
			<SheetContent className="flex flex-col">
				<SheetHeader className="text-start">
					<SheetTitle>{isUpdate ? "Update" : "Create"} Task</SheetTitle>
					<SheetDescription>
						{isUpdate
							? "Update the task by providing necessary info."
							: "Add a new task by providing necessary info."}
						Click save when you&apos;re done.
					</SheetDescription>
				</SheetHeader>
				<form
					className="flex-1 space-y-6 overflow-y-auto px-4"
					id="tasks-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField
						children={(field) => (
							<field.TextField placeholder="Enter a title" />
						)}
						name="title"
					/>
					<form.AppField
						children={(field) => (
							<field.SelectField
								options={[
									{ label: "In Progress", value: "in progress" },
									{ label: "Backlog", value: "backlog" },
									{ label: "Todo", value: "todo" },
									{ label: "Canceled", value: "canceled" },
									{ label: "Done", value: "done" },
								]}
								placeholder="Select dropdown"
							/>
						)}
						name="status"
					/>
					<form.AppField
						children={(field) => (
							<field.RadioGroupField
								description="Select task priority level"
								label="Task Priority"
								options={[
									{ label: "Documentation", value: "documentation" },
									{ label: "Feature", value: "feature" },
									{ label: "Bug", value: "bug" },
								]}
							/>
						)}
						name="label"
					/>
					<form.AppField
						children={(field) => (
							<field.RadioGroupField
								description="Select task priority level"
								label="Priority"
								options={[
									{ label: "High", value: "high" },
									{ label: "Medium", value: "medium" },
									{ label: "Low", value: "low" },
								]}
							/>
						)}
						name="priority"
					/>
				</form>
				<SheetFooter className="gap-2">
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
					<form.AppForm>
						<form.SubmitButton>Save changes</form.SubmitButton>
					</form.AppForm>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
