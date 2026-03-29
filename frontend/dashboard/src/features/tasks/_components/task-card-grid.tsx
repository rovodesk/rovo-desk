import type { Task } from "../data/types";
import { TaskCard } from "./task-card";

type TaskCardGridProps = {
	data: Task[];
};

export function TaskCardGrid({ data }: TaskCardGridProps) {
	if (!data.length) {
		return (
			<div className="flex h-40 items-center justify-center rounded-xl border">
				<p className="text-muted-foreground text-sm">No tasks found.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
			{data.map((task) => (
				<TaskCard key={task.id} task={task} />
			))}
		</div>
	);
}
