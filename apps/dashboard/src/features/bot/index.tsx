import { Link } from "@tanstack/react-router";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zero-heads-lab/design-system/components/empty";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { format } from "date-fns";
import { Calendar, MessageSquarePlus, Plus, Settings2 } from "lucide-react";
import { useMemo } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useChatbot } from "@/hooks/use-chatbot";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
import { BotHealthItem } from "./_components/bot-health";
import { ConnectionIcon } from "./_components/connection-icon";

export const BotHome = () => {
	const { connections, toggleConnectionAsync } = useChatbot();

	const toggleActive = async (connectionId: string) => {
		await toggleConnectionAsync({ connectionId });
	};

	const filteredConnections = useMemo(() => {
		return (connections ?? []).filter((connection) => !connection.deletedAt);
	}, [connections]);

	const hasConnections = filteredConnections.length > 0;

	return (
		<>
			<Header>
				<div className="flex items-center space-x-4">
					<Breadcrumbs />
				</div>
				<div className="ms-auto flex items-center space-x-4">
					<Button asChild>
						<Link to="/bot/customise">Customise</Link>
					</Button>
					<ThemeSwitch />
				</div>
			</Header>

			<MainContent>
				<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Connections Table */}
					<div className="lg:col-span-2">
						<section className="rounded-xl border bg-card">
							<div className="flex items-center justify-between border-b p-6">
								<div>
									<h2 className="font-semibold text-lg">Connections</h2>
									<p className="text-muted-foreground text-sm">
										Manage your chatbot integrations and platforms.
									</p>
								</div>
								{hasConnections && (
									<Button asChild size="sm">
										<Link to="/bot/connection/add">
											<Plus className="mr-2 h-4 w-4" />
											Add New
										</Link>
									</Button>
								)}
							</div>

							{hasConnections ? (
								<div className="divide-y">
									{filteredConnections.map((connection) => (
										<div
											className="group flex flex-col justify-between p-6 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
											key={connection.id}
										>
											<div className="flex items-start gap-4">
												<ConnectionIcon
													fallbackText={connection.connectionName}
													iconKey={connection.connectionIcon}
												/>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<p className="font-semibold leading-none">
															{connection.connectionName}
														</p>
														<Badge
															className="text-[10px] uppercase tracking-wider"
															variant="secondary"
														>
															{connection.connectionType}
														</Badge>
													</div>
													<div className="flex items-center text-muted-foreground text-xs">
														<Calendar className="mr-1 h-3 w-3" />
														Added{" "}
														{format(
															new Date(connection.createdAt),
															"MMM d, yyyy"
														)}
													</div>
												</div>
											</div>

											<div className="mt-4 flex items-center justify-between gap-6 sm:mt-0">
												<div className="flex items-center gap-3">
													<span
														className={`font-medium text-xs ${connection.isActive ? "text-green-600" : "text-muted-foreground"}`}
													>
														{connection.isActive ? "Active" : "Paused"}
													</span>
													<Switch
														checked={connection.isActive}
														onCheckedChange={() => toggleActive(connection.id)}
													/>
												</div>

												<Button
													asChild
													className="h-8 w-8"
													size="icon"
													variant="ghost"
												>
													<Link
														params={{ connectionId: connection.id }}
														to={"/bot/connection/manage/$connectionId"}
													>
														<Settings2 className="h-4 w-4" />
														<span className="sr-only">Manage</span>
													</Link>
												</Button>
											</div>
										</div>
									))}
								</div>
							) : (
								<Empty className="py-20">
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<MessageSquarePlus className="h-12 w-12 text-muted-foreground/50" />
										</EmptyMedia>
										<EmptyTitle>No active connections</EmptyTitle>
										<EmptyDescription>
											Connect your bot to WhatsApp, Slack, or Discord to start
											chatting with your users.
										</EmptyDescription>
									</EmptyHeader>
									<EmptyContent>
										<Button asChild>
											<Link to="/bot/connection/add">
												<Plus className="mr-2 h-4 w-4" />
												Add Your First Connection
											</Link>
										</Button>
									</EmptyContent>
								</Empty>
							)}
						</section>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<HealthSection hasConnections={hasConnections} />
						{hasConnections && <ProTipSection />}
					</div>
				</div>
			</MainContent>
		</>
	);
};

export const HealthSection = ({
	hasConnections,
}: {
	hasConnections: boolean;
}) => {
	return (
		<div
			className={`rounded-xl border p-6 ${hasConnections ? "bg-muted/30" : "opacity-50 grayscale"}`}
		>
			<h2 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
				Widget Health
			</h2>
			{hasConnections ? (
				<div className="space-y-4">
					<BotHealthItem label="API Connection" status="Healthy" />
					<BotHealthItem label="Database Latency" status="Low" />
					<BotHealthItem label="Script Integration" status="Active" />
				</div>
			) : (
				<p className="text-xs italic">Connect a source to monitor health.</p>
			)}
		</div>
	);
};

export const ProTipSection = () => {
	return (
		<div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-xl">
			{/* Subtle background decoration */}
			<div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

			<h3 className="mb-2 flex items-center gap-2 font-bold text-lg">
				Pro Tip 💡
			</h3>
			<p className="text-sm leading-relaxed opacity-90">
				Remove Branding and add your brand assets to make your bot unique and
				increase engagement.
			</p>
			<Button
				className="mt-4 w-full font-semibold shadow-sm transition-all hover:scale-[1.02]"
				variant="secondary"
			>
				Upgrade to Pro
			</Button>
		</div>
	);
};

export default BotHome;
