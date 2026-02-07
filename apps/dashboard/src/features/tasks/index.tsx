import { Search } from "@zero-heads-lab/design-system/components/search";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
<<<<<<< HEAD
<<<<<<< HEAD
import { Header } from "@zero-heads-lab/design-system/layout/header";
import { MainContent } from "@zero-heads-lab/design-system/layout/main-content";
=======
import { Search } from "@/components/search";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
import { Header } from "@zero-heads-lab/design-system/layout/header";
import { MainContent } from "@zero-heads-lab/design-system/layout/main-content";
>>>>>>> 41a6b28 (Feat/api (#6))
import { TasksDialogs } from "./_components/tasks-dialog";
import { TasksPrimaryButtons } from "./_components/tasks-primary-buttons";
import { TasksProvider } from "./_components/tasks-provider";
import { TasksTable } from "./_components/tasks-table";
import { tasks } from "./data";

export function Tasks() {
	return (
		<TasksProvider>
			<Header fixed>
				<Search />
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitch />
				</div>
			</Header>

			<MainContent className="flex flex-1 flex-col">
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
							<h1 className="text-3xl">Kanban</h1>
						</TabsContent>
						<TabsContent value="roadmap">
							<h1 className="text-3xl">Roadmap</h1>
						</TabsContent>
					</div>
				</Tabs>
			</MainContent>

			<TasksDialogs />
		</TasksProvider>
	);
}
