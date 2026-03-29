import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Card } from "@zero-heads-lab/design-system/components/ui/card";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type { Task } from "../data/types";

type TaskCardProps = {
	task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
	return (
		<Card className="group cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="font-semibold text-sm">#{task.id}</p>
					<h3 className="mt-1 font-medium text-base">{task.title}</h3>
				</div>

				<div className="flex flex-col items-end gap-2">
					<Badge
						className={cn(
							task.status === "done" && "bg-green-50 text-green-600",
							task.status === "in-progress" && "bg-yellow-50 text-yellow-600",
							task.status === "todo" && "bg-muted text-muted-foreground"
						)}
						variant="secondary"
					>
						{task.status}
					</Badge>

					<Badge
						className={cn(
							task.priority === "high" && "bg-red-50 text-red-600",
							task.priority === "medium" && "bg-orange-50 text-orange-600",
							task.priority === "low" && "bg-muted text-muted-foreground"
						)}
						variant="outline"
					>
						{task.priority}
					</Badge>
				</div>
			</div>
		</Card>
	);
}
