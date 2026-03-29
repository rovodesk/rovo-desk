import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import { MainContent } from "@/layout/main-content";
import { TaskCardGrid } from "./_components/task-card-grid";
import { RoadmapCalendar } from "./_components/task-roadmap-calender";
import { TasksDialogs } from "./_components/tasks-dialog";
import { TasksPrimaryButtons } from "./_components/tasks-primary-buttons";
import { TasksProvider } from "./_components/tasks-provider";
import { TasksTable } from "./_components/tasks-table";
import { tasks } from "./data";

export function Tasks() {
	return (
		<TasksProvider>
			<MainContent className="flex flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-end justify-between">
					<div>
						<h2 className="font-bold text-2xl tracking-tight">Tasks</h2>
						<p className="text-muted-foreground text-sm">
							Here&apos;s a list of your tasks for this month!
						</p>
					</div>
					<TasksPrimaryButtons />
				</div>
				<Tabs defaultValue="list">
					<TabsList>
						<TabsTrigger value="kanban">Kanban</TabsTrigger>
						<TabsTrigger value="list">List</TabsTrigger>
						<TabsTrigger value="roadmap">Roadmap</TabsTrigger>
					</TabsList>

					<div className="mt-2">
						<TabsContent value="list">
							<TasksTable data={tasks} />
						</TabsContent>
						<TabsContent value="kanban">
							<TaskCardGrid data={tasks} />
						</TabsContent>
						<TabsContent className="mt-2" value="roadmap">
							<RoadmapCalendar data={tasks} />
						</TabsContent>
					</div>
				</Tabs>
			</MainContent>

			<TasksDialogs />
		</TasksProvider>
	);
}
