import { IconBrandShopee, IconBrandWhatsapp } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import {
	BarChart3,
	MessageSquare,
	Plus,
	Settings,
	Users,
	Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";

const integrations: {
	id: string;
	name: string;
	icon: React.ComponentType;
	active: boolean;
}[] = [
	{
		id: "asdasdasdasd",
		name: "WhatsApp",
		icon: IconBrandWhatsapp,
		active: true,
	},
	{
		id: "asdasdasdasdsdffgfg",
		name: "Shopee",
		icon: IconBrandShopee,
		active: true,
	},
];

export const BotHome = () => {
	return (
		<>
			<Header>
				<div className="flex items-center space-x-4">
					<Breadcrumbs />
				</div>
				<div className="ms-auto flex items-center space-x-4">
					<ThemeSwitch />
				</div>
			</Header>

			{/* Stats Overview */}
			<MainContent>
				<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
					{[
						{
							label: "Active Chats",
							value: "124",
							icon: MessageSquare,
							color: "text-blue-600",
						},
						{
							label: "Success Rate",
							value: "92%",
							icon: Zap,
							color: "text-yellow-500",
						},
						{
							label: "Total Users",
							value: "1,205",
							icon: Users,
							color: "text-purple-600",
						},
						{
							label: "Avg Response",
							value: "1.2s",
							icon: BarChart3,
							color: "text-green-600",
						},
					].map((stat, i) => (
						<div className="rounded-xl border p-6 shadow-sm" key={i}>
							<div className="flex items-start justify-between">
								<stat.icon className={`${stat.color} mb-4`} size={24} />
								<span className="rounded bg-green-50 px-2 py-1 font-medium text-green-600 text-xs">
									+12%
								</span>
							</div>
							<p className="font-medium text-gray-500 text-sm">{stat.label}</p>
							<h3 className="mt-1 font-bold text-2xl">{stat.value}</h3>
						</div>
					))}
				</div>

				<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Customization Panel */}
					<div className="space-y-6 lg:col-span-2">
						{/* Sync */}
						<section className="rounded-xl border p-6">
							<h2 className="mb-4 font-semibold text-lg">Sync Knowledge</h2>
							<div className="flex gap-4">
								<div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-gray-200 border-dashed p-8 text-center">
									<div className="mb-3 rounded-full bg-indigo-50 p-3 text-indigo-600">
										<Settings size={24} />
									</div>
									<p className="font-medium">Sync Website</p>
									<p className="text-xs">Fetch data from your URL</p>
								</div>
								<div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-gray-200 border-dashed p-8 text-center">
									<div className="mb-3 rounded-full bg-green-50 p-3 text-green-600">
										<Plus size={24} />
									</div>
									<p className="font-medium">Upload PDF</p>
									<p className="text-gray-400 text-xs">Max size 10MB</p>
								</div>
							</div>
						</section>

						{/* Sources */}
						<section className="rounded-xl border bg-background p-6">
							<div className="mb-6 flex items-center justify-between">
								<h2 className="font-semibold text-lg">Sources</h2>
								<Button asChild size="sm">
									<Link to="/integrations">
										<Plus />
										Add Source
									</Link>
								</Button>
							</div>

							<ul className="divide-y">
								{integrations.map((integration) => (
									<li
										className="flex items-center justify-between py-4"
										key={integration.id}
									>
										{/* LEFT SIDE */}
										<div className="flex items-center gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
												{integration.icon && <integration.icon />}
											</div>

											<p className="font-medium">{integration.name}</p>
										</div>

										{/* RIGHT SIDE */}
										<div className="flex items-center gap-4">
											<span
												className={`rounded-full px-3 py-1 font-medium text-xs ${
													integration.active
														? "bg-emerald-50 text-emerald-600"
														: "bg-muted text-muted-foreground"
												}`}
											>
												{integration.active ? "Active" : "Inactive"}
											</span>

											<button
												className="font-medium text-primary text-sm hover:underline"
												type="button"
											>
												{integration.active ? "Manage" : "Connect"}
											</button>
										</div>
									</li>
								))}
							</ul>
						</section>
					</div>

					{/* Sidebar Actions */}
					<div className="space-y-6">
						<div className="rounded-xl bg-indigo-900 p-6 text-white shadow-indigo-200 shadow-lg">
							<h3 className="mb-2 font-bold text-lg">Pro Tip 💡</h3>
							<p className="text-indigo-200 text-sm leading-relaxed">
								Bots with a custom "Welcome Message" see a 40% higher engagement
								rate.
							</p>
							<button className="mt-4 w-full rounded-lg bg-white py-2 font-semibold text-indigo-900 text-sm transition hover:bg-indigo-50">
								Upgrade Greeting
							</button>
						</div>

						<div className="rounded-xl border p-6">
							<h2 className="mb-4 font-semibold">Widget Health</h2>
							<div className="space-y-4">
								<HealthItem label="API Connection" status="Healthy" />
								<HealthItem label="Database Latency" status="Low" />
								<HealthItem label="Script Integration" status="Active" />
							</div>
						</div>
					</div>
				</div>
			</MainContent>
		</>
	);
};

const HealthItem = ({ label, status }: { label: string; status: string }) => (
	<div className="flex items-center justify-between text-sm">
		<span className="text-gray-500">{label}</span>
		<div className="flex items-center gap-2">
			<div className="h-2 w-2 rounded-full bg-green-500" />
			<span className="font-medium">{status}</span>
		</div>
	</div>
);

export default BotHome;
