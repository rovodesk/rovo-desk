import { getRouteApi, Link } from "@tanstack/react-router";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	InputGroup,
	InputGroupButton,
	InputGroupInput,
} from "@zero-heads-lab/design-system/components/ui/input-group";
import { ScrollArea } from "@zero-heads-lab/design-system/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import {
	Tabs,
	TabsList,
	TabsTrigger,
} from "@zero-heads-lab/design-system/components/ui/tabs";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	ChevronDown,
	Grid2X2,
	LayoutList,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { type ChangeEvent, useMemo } from "react";
import { MainContent } from "@/layout/main-content";
import { DocCard } from "./_components/document-card";
import { BlankTemplateCard, TemplateCard } from "./_components/template-card";

const templates = [
	{ id: "0", title: "Resume", description: "Resume template" },
	{ id: "1", title: "Letter", description: "Letter template" },
	{ id: "2", title: "Proposal", description: "Proposal template" },
	{ id: "3", title: "Invoice", description: "Invoice template" },
	{ id: "4", title: "Receipt", description: "Receipt template" },
	{ id: "5", title: "Contract", description: "Contract template" },
	{ id: "6", title: "Open Bank", description: "Open Bank template" },
	{ id: "7", title: "Open Invoice", description: "Open Invoice template" },
	{ id: "8", title: "Open Receipt", description: "Open Receipt template" },
];

const documents = [
	{
		id: "0",
		title: "API Notes",
		createdAt: new Date("2024-01-05"),
		isShared: true,
	},
	{ id: "1", title: "Product Specs", createdAt: new Date("2024-01-04") },
	{ id: "2", title: "Design Review", createdAt: new Date("2024-01-03") },
	{
		id: "3",
		title: "API Notes",
		createdAt: new Date("2024-01-02"),
		isFavorite: true,
	},
	{ id: "4", title: "Product Specs", createdAt: new Date("2024-01-01") },
	{ id: "5", title: "Design Review", createdAt: new Date("2024-01-01") },
	{ id: "6", title: "API Notes", createdAt: new Date("2024-01-02") },
	{ id: "7", title: "Product Specs", createdAt: new Date("2024-01-03") },
	{
		id: "8",
		title: "Design Review",
		createdAt: new Date("2024-01-04"),
		isShared: true,
	},
	{
		id: "9",
		title: "API Notes",
		createdAt: new Date("2024-01-05"),
		isFavorite: true,
	},
	{ id: "10", title: "Product Specs", createdAt: new Date("2024-01-06") },
	{
		id: "11",
		title: "Design Review",
		createdAt: new Date("2024-01-07"),
		isShared: true,
	},
	{
		id: "12",
		title: "API Notes",
		createdAt: new Date("2024-01-08"),
		isFavorite: true,
	},
	{ id: "13", title: "Product Specs", createdAt: new Date("2024-01-09") },
	{ id: "14", title: "Design Review", createdAt: new Date("2024-01-10") },
	{ id: "15", title: "API Notes", createdAt: new Date("2024-01-11") },
];

const route = getRouteApi("/_authenticated/help-center/");

type ViewType = "list" | "card";
type SortType = "asc" | "desc";
type TabsType = "all" | "shared" | "favorites";

export function KnowledgeBaseHome() {
	const {
		filter = "",
		tabs = "all",
		view = "card",
		sort: initSort = "desc",
	} = route.useSearch();

	const navigate = route.useNavigate();

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		navigate({ search: (prev) => ({ ...prev, filter: value || undefined }) });
	};

	const handleTabChange = (type: string) => {
		navigate({ search: (prev) => ({ ...prev, tabs: type as TabsType }) });
	};

	const handleViewChange = (type: ViewType) => {
		navigate({ search: (prev) => ({ ...prev, view: type }) });
	};

	const handleSortChange = (type: SortType) => {
		navigate({ search: (prev) => ({ ...prev, sort: type }) });
	};

	const sortedDocuments = useMemo(() => {
		let filtered = [...documents];

		// 1. Filter by Tab logic
		if (tabs === "favorites") {
			filtered = filtered.filter((d) => d.isFavorite);
		} else if (tabs === "shared") {
			filtered = filtered.filter((d) => d.isShared);
		}

		// 2. Filter by Search term
		if (filter) {
			filtered = filtered.filter((d) =>
				d.title.toLowerCase().includes(filter.toLowerCase())
			);
		}

		// 3. Apply Date Sorting
		return filtered.sort((a, b) => {
			const timeA = a.createdAt.getTime();
			const timeB = b.createdAt.getTime();

			return initSort === "asc" ? timeA - timeB : timeB - timeA;
		});
	}, [initSort, filter, tabs]);

	return (
		<MainContent
			className="px-4 py-6 sm:px-6 lg:px-8"
			headerRightContent={
				<div className="flex items-center gap-2">
					<Separator orientation="vertical" />
					<InputGroup className="ml-4 w-full max-w-sm">
						<InputGroupInput onChange={handleSearch} placeholder="Search..." />
						<InputGroupButton>
							<Search />
						</InputGroupButton>
					</InputGroup>
				</div>
			}
		>
			{/* 1. Templates Section - Horizontal ScrollFade */}
			<section className="mb-10 shrink-0">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
						Start from a template
					</h2>
					<Button className="text-xs" size="sm" variant="ghost">
						View all <ChevronDown className="ml-1 size-3" />
					</Button>
				</div>

				<ScrollArea axis="horizontal" className="pb-4" withFade={true}>
					<div className="flex gap-5 px-1">
						{" "}
						{/* px-1 prevents card shadows from clipping */}
						<BlankTemplateCard />
						{templates.map((template) => (
							<Link
								className="transition-transform hover:-translate-y-1"
								key={template.id}
								params={{ documentId: template.id }}
								to={"/help-center/documents/$documentId"}
							>
								<TemplateCard {...template} />
							</Link>
						))}
					</div>
				</ScrollArea>
			</section>

			{/* 2. Recent Documents Section - Vertical ScrollFade */}
			<section className="flex min-h-0 flex-1 flex-col space-y-6">
				<div className="flex shrink-0 flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
					<Tabs
						className="w-full sm:w-auto"
						defaultValue={tabs}
						onValueChange={handleTabChange}
					>
						<TabsList className="h-9 bg-muted/50">
							<TabsTrigger
								className={tabs === "all" ? "text-accent-foreground!" : ""}
								value="all"
							>
								All Docs
							</TabsTrigger>
							<TabsTrigger
								className={tabs === "shared" ? "text-accent-foreground!" : ""}
								value="shared"
							>
								Shared
							</TabsTrigger>
							<TabsTrigger
								className={
									tabs === "favorites" ? "text-accent-foreground!" : ""
								}
								value="favorites"
							>
								Favorites
							</TabsTrigger>
						</TabsList>
					</Tabs>

					<div className="flex items-center gap-3">
						<div className="flex items-center rounded-lg border bg-background p-1 shadow-sm">
							<button
								className={cn(
									"rounded-md p-1 transition-all",
									view === "card"
										? "bg-muted shadow-sm"
										: "text-muted-foreground"
								)}
								onClick={() => handleViewChange("card")}
							>
								<Grid2X2 size={14} />
							</button>
							<button
								className={cn(
									"rounded-md p-1 transition-all",
									view === "list"
										? "bg-muted shadow-sm"
										: "text-muted-foreground"
								)}
								onClick={() => handleViewChange("list")}
							>
								<LayoutList size={14} />
							</button>
						</div>

						<Select
							onValueChange={(v) => handleSortChange(v as SortType)}
							value={initSort}
						>
							<SelectTrigger className="h-9 w-[150px] bg-background text-xs shadow-sm">
								<SlidersHorizontal className="mr-2 size-3" />
								<SelectValue placeholder="Sort" />
							</SelectTrigger>
							<SelectContent align="end">
								<SelectItem value="desc">Newest first</SelectItem>
								<SelectItem value="asc">Oldest first</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Fixed-height Scrollable Area with Vertical Fade */}
				<div className="relative min-h-0 flex-1">
					<ScrollArea axis="vertical" className="h-full" withFade={true}>
						<div
							className={cn(
								"grid gap-6 pt-2 pb-20",
								view === "card"
									? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
									: "grid-cols-1"
							)}
						>
							{sortedDocuments.map((doc) => (
								<Link
									className="group"
									key={doc.id}
									params={{ documentId: doc.id }}
									to={"/help-center/documents/$documentId"}
								>
									<DocCard
										{...doc}
										className="transition-all"
										isFavourite={doc.isFavorite}
										variant={view}
									/>
								</Link>
							))}
						</div>
					</ScrollArea>
				</div>
			</section>
		</MainContent>
	);
}
