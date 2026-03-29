import { ConfirmDialog } from "@zero-heads-lab/design-system/components/confirm-dialog";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { TasksImportDialog } from "./tasks-import-dialog";
import { TasksMutateDrawer } from "./tasks-mutate-drawer";
import { useTasks } from "./tasks-provider";

export function TasksDialogs() {
	const { open, setOpen, currentRow, setCurrentRow } = useTasks();
	return (
		<>
			<TasksMutateDrawer
				key="task-create"
				onOpenChange={() => setOpen("create")}
				open={open === "create"}
			/>

			<TasksImportDialog
				key="tasks-import"
				onOpenChange={() => setOpen("import")}
				open={open === "import"}
			/>

			{currentRow && (
				<>
					<TasksMutateDrawer
						currentRow={currentRow}
						key={`task-update-${currentRow.id}`}
						onOpenChange={() => {
							setOpen("update");
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						open={open === "update"}
					/>

					<ConfirmDialog
						className="max-w-md"
						confirmText="Delete"
						destructive
						key="task-delete"
						onConfirm={() => {
							setOpen(null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
							toast.success("The following task has been deleted:", {
								description: <pre>{JSON.stringify(currentRow, null, 2)}</pre>,
							});
						}}
						onOpenChange={(open) => {
							setOpen(open ? "delete" : null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						open={open === "delete"}
						subtitle={
							<>
								You are about to delete a task with the ID{" "}
								<strong>{currentRow.id}</strong>. <br />
								This action cannot be undone.
							</>
						}
						title={`Delete this task: ${currentRow.id} ?`}
					/>
				</>
			)}
		</>
	);
}
