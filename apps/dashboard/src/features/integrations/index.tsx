import { getRouteApi } from "@tanstack/react-router";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
import { Separator } from "@zero-heads-lab/design-system/components/ui/separator";
import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { apps } from "@/data/integrations";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";

const route = getRouteApi("/_authenticated/integrations/");

type AppType = "all" | "connected" | "notConnected";

const appText = new Map<AppType, string>([
	["all", "All Apps"],
	["connected", "Connected"],
	["notConnected", "Not Connected"],
]);

export function IntegrationsHome() {
	const {
		filter = "",
		type = "all",
		sort: initSort = "asc",
	} = route.useSearch();

	const navigate = route.useNavigate();

	const [sort, setSort] = useState(initSort);
	const [appType, setAppType] = useState<AppType>(type);
	const [searchTerm, setSearchTerm] = useState(filter);

	const filteredApps = apps
		.sort((a, b) =>
			sort === "asc"
				? a.name.localeCompare(b.name)
				: b.name.localeCompare(a.name)
		)
		.filter((app) =>
			appType === "connected"
				? app.connected
				: // biome-ignore lint/style/noNestedTernary: Will to
					appType === "notConnected"
					? !app.connected
					: true
		)
		.filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		navigate({
			search: (prev) => ({
				...prev,
				filter: e.target.value || undefined,
			}),
		});
	};

	const handleTypeChange = (value: AppType) => {
		setAppType(value);
		navigate({
			search: (prev) => ({
				...prev,
				type: value === "all" ? undefined : value,
			}),
		});
	};

	const handleSortChange = (sort: "asc" | "desc") => {
		setSort(sort);
		navigate({ search: (prev) => ({ ...prev, sort }) });
	};

	return (
		<>
			{/* ===== Top Heading ===== */}
			<Header>
				<div className="ms-auto flex items-center gap-4">
					<ThemeSwitch />
				</div>
			</Header>

			{/* ===== Content ===== */}
			<MainContent fixed>
				<div>
					<h1 className="font-bold text-2xl tracking-tight">
						App Integrations
					</h1>
					<p className="text-muted-foreground">
						Here&apos;s a list of your apps for the integration!
					</p>
				</div>
				<div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
					<div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
						<Input
							className="h-9 w-40 rounded-md border p-2 lg:w-[250px]"
							onChange={handleSearch}
							placeholder="Filter apps..."
							value={searchTerm}
						/>
						<Select onValueChange={handleTypeChange} value={appType}>
							<SelectTrigger className="w-36">
								<SelectValue>{appText.get(appType)}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Apps</SelectItem>
								<SelectItem value="connected">Connected</SelectItem>
								<SelectItem value="notConnected">Not Connected</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Select onValueChange={handleSortChange} value={sort}>
						<SelectTrigger className="w-16">
							<SelectValue>
								<SlidersHorizontal size={18} />
							</SelectValue>
						</SelectTrigger>
						<SelectContent align="end">
							<SelectItem value="asc">
								<div className="flex items-center gap-4">
									<ArrowUpAZ size={16} />
									<span>Ascending</span>
								</div>
							</SelectItem>
							<SelectItem value="desc">
								<div className="flex items-center gap-4">
									<ArrowDownAZ size={16} />
									<span>Descending</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Separator className="shadow-sm" />
				<ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
					{filteredApps.map((app) => (
						<li
							className="rounded-lg border p-4 hover:shadow-md"
							key={app.name}
						>
							<div className="mb-8 flex items-center justify-between">
								<div
									className={
										"flex size-10 items-center justify-center rounded-lg bg-muted p-2"
									}
								>
									{app.logo}
								</div>
								<Button
									className={`${app.connected ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900" : ""}`}
									size="sm"
									variant="outline"
								>
									{app.connected ? "Connected" : "Connect"}
								</Button>
							</div>
							<div>
								<h2 className="mb-1 font-semibold">{app.name}</h2>
								<p className="line-clamp-2 text-gray-500">{app.desc}</p>
							</div>
						</li>
					))}
				</ul>
			</MainContent>
		</>
	);
}
