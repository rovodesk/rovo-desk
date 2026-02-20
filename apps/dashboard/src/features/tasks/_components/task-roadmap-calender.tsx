import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Card } from "@zero-heads-lab/design-system/components/ui/card";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import type { Task } from "../data/types";

type RoadmapCalendarProps = {
	data: Task[];
};

export function RoadmapCalendar({ data }: RoadmapCalendarProps) {
	const today = new Date();
	const start = startOfMonth(today);
	const end = endOfMonth(today);

	const days = eachDayOfInterval({ start, end });

	const getTasksForDay = (day: Date) => {
		return data.filter((task) => {
			if (!task.dueDate) return false;
			return (
				format(new Date(task.dueDate), "yyyy-MM-dd") ===
				format(day, "yyyy-MM-dd")
			);
		});
	};

	return (
		<div className="space-y-6">
			<h2 className="font-semibold text-lg">{format(today, "MMMM yyyy")}</h2>

			<div className="grid grid-cols-7 gap-4 text-sm">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div
						className="text-center font-medium text-muted-foreground"
						key={day}
					>
						{day}
					</div>
				))}

				{days.map((day) => {
					const tasksForDay = getTasksForDay(day);

					return (
						<Card
							className="flex min-h-[120px] flex-col gap-2 p-3"
							key={day.toDateString()}
						>
							<p className="text-muted-foreground text-xs">
								{format(day, "d")}
							</p>

							{tasksForDay.map((task) => (
								<Badge className="truncate" key={task.id} variant="secondary">
									{task.title}
								</Badge>
							))}
						</Card>
					);
				})}
			</div>
		</div>
	);
}
