import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@zero-heads-lab/design-system/components/ui/dialog";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { z } from "zod";

const formSchema = z.object({
	file: z
		.instanceof(File, { message: "Please upload a file" })
		.refine((file) => file.type === "text/csv", {
			message: "Please upload csv format.",
		}),
});

type TaskImportDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function TasksImportDialog({
	open,
	onOpenChange,
}: TaskImportDialogProps) {
	const form = useAppForm({
		defaultValues: {
			file: null as File | null,
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = formSchema.safeParse(value);

				if (!result.success) {
					return result.error.flatten().fieldErrors;
				}

				return {};
			},
		},
		onSubmit: ({ value }) => {
			const file = value.file;

			const fileDetails = {
				name: file?.name,
				size: file?.size,
				type: file?.type,
			};

			toast.success("You have imported the following file:", {
				description: <pre>{JSON.stringify(fileDetails, null, 2)}</pre>,
			});
			onOpenChange(false);
		},
	});
	return (
		<Dialog
			onOpenChange={(val) => {
				onOpenChange(val);
				form.reset();
			}}
			open={open}
		>
			<DialogContent className="gap-2 sm:max-w-sm">
				<DialogHeader className="text-start">
					<DialogTitle>Import Tasks</DialogTitle>
					<DialogDescription>
						Import tasks quickly from a CSV file.
					</DialogDescription>
				</DialogHeader>
				<form
					id="task-import-form"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.AppField
						children={(field) => (
							<field.FileUploadField
								accept="text/csv"
								description="We will not share your email address."
								multiple={false}
							/>
						)}
						name="file"
					/>
				</form>
				<DialogFooter className="gap-2">
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
					<form.AppForm>
						<form.SubmitButton>Import</form.SubmitButton>
					</form.AppForm>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
