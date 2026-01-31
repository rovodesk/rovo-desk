import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
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
						desc={
							<>
								You are about to delete a task with the ID{" "}
								<strong>{currentRow.id}</strong>. <br />
								This action cannot be undone.
							</>
						}
						destructive
						handleConfirm={() => {
							setOpen(null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
							toast.success("The following task has been deleted:", {
								description: <pre>{JSON.stringify(currentRow, null, 2)}</pre>,
							});
						}}
						key="task-delete"
						onOpenChange={(open) => {
							setOpen(open ? "delete" : null);
							setTimeout(() => {
								setCurrentRow(null);
							}, 500);
						}}
						open={open === "delete"}
						title={`Delete this task: ${currentRow.id} ?`}
					/>
				</>
			)}
		</>
	);
}
