import { useQuery } from "@tanstack/react-query";
import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Switch } from "@zero-heads-lab/design-system/components/ui/switch";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { ChevronLeft, Loader2, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { useChatbot } from "@/hooks/use-chatbot";
import { Header } from "@/layout/header";
import { MainContent } from "@/layout/main-content";
import { ConnectionIcon } from "../_components/connection-icon";
import { KeyManager } from "../_components/key-manager";

const route = getRouteApi(
	"/_authenticated/bot/connection/manage/$connectionId"
);

const connectionFormSchema = z.object({
	connectionName: z.string().min(1, "Connection name is required"),
	connectionSource: z.string().min(1, "Connection source is required"),
	connectionType: z.enum(["CLIENT", "SERVER"]),
});

const ManageConnection = () => {
	const { connectionId } = route.useParams();
	const router = useRouter();

	const {
		getConnectionQueryOptions,
		deleteConnectionAsync,
		updateConnectionAsync,
		toggleConnection,
	} = useChatbot();

	const { data: connection, isLoading } = useQuery(
		getConnectionQueryOptions(connectionId)
	);

	const toggleActive = (connectionId: string) => {
		toggleConnection({ connectionId });
	};

	const form = useAppForm({
		defaultValues: {
			connectionName: connection?.connectionName,
			connectionSource: connection?.connectionSource,
			connectionType: connection?.connectionType,
		},
		validators: {
			onSubmit: connectionFormSchema,
		},
		onSubmit: async ({ value }) => {
			await updateConnectionAsync({
				connectionId,
				connectionName: value.connectionName,
				connectionSource: value.connectionSource,
			});
			toast.success("Connection updated successfully");
		},
	});

	const handleDelete = async () => {
		try {
			await deleteConnectionAsync({ connectionId });
			toast.success("Connection deleted successfully");
			router.navigate({ to: "/bot" });
		} catch {
			toast.error("Failed to delete connection");
		}
	};

	if (!connection) {
		return <div>Connection not found</div>;
	}

	return (
		<div className="min-h-screen bg-background">
			<Header>
				<div className="flex items-center gap-4">
					<Button asChild size="icon" variant="ghost">
						<Link to="/bot">
							<ChevronLeft className="h-5 w-5" />
						</Link>
					</Button>
					<div className="flex items-center gap-3">
						{isLoading ? (
							<Skeleton className="h-8 w-8" />
						) : (
							<>
								<ConnectionIcon
									className="h-8 w-8"
									iconKey={connection.connectionIcon}
								/>
								<h1 className="font-bold text-xl tracking-tight">
									{connection.connectionName}
								</h1>
								<Badge variant="secondary">{connection.connectionType}</Badge>
							</>
						)}
					</div>
				</div>
			</Header>

			<MainContent>
				<div className="mx-auto mt-6 max-w-4xl space-y-8">
					{/* 1. Identity & Configuration Section */}
					<section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
						{/* Header with Integrated Status Switch */}
						<div className="flex items-center justify-between border-b bg-muted/30 p-6">
							<div>
								<h2 className="font-semibold text-lg leading-none">
									General Settings
								</h2>
								<p className="mt-1.5 text-muted-foreground text-sm">
									Update the connection identity and endpoint configuration.
								</p>
							</div>
							<div className="flex items-center gap-3 rounded-full border bg-background px-3 py-1.5 shadow-sm">
								<span
									className={`font-bold text-[11px] uppercase tracking-wider ${connection.isActive ? "text-green-600" : "text-slate-400"}`}
								>
									{connection.isActive ? "Active" : "Paused"}
								</span>
								<Switch
									checked={connection.isActive}
									onCheckedChange={() => toggleActive(connection.id)}
								/>
							</div>
						</div>

						<div className="p-6">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									form.handleSubmit(e);
								}}
							>
								<form.AppForm>
									<div className="grid gap-8 md:grid-cols-2">
										{/* Left Column: Identity */}
										<div className="space-y-5">
											<form.AppField
												children={(field) => (
													<field.TextField
														defaultValue={connection.connectionName}
														label="Connection Name"
														placeholder="e.g. Production Database"
													/>
												)}
												name="connectionName"
											/>
											<form.AppField
												children={(field) => (
													<field.TextField
														defaultValue={connection.connectionType}
														description="Type cannot be changed after creation."
														disabled
														label="Connection Type"
													/>
												)}
												name="connectionType"
											/>
										</div>

										{/* Right Column: Source/Endpoint */}
										<div className="space-y-8">
											{/* Optional: Add a helper note or metadata here */}
											<div className="flex items-center justify-center rounded-lg border border-dashed p-4 text-muted-foreground text-xs">
												System ID: {connection?.id || "Pending..."}
											</div>
											<form.AppField
												children={(field) => (
													<field.TextField
														defaultValue={connection.connectionSource}
														label="Source Endpoint"
														placeholder="https://api.provider.com/v1"
													/>
												)}
												name="connectionSource"
											/>
										</div>
									</div>

									<div className="mt-8 flex items-center justify-between border-t pt-6">
										<p className="text-muted-foreground text-xs">
											Last synced: {new Date().toLocaleDateString()}
										</p>
										<div className="flex gap-3">
											{isLoading ? (
												<Button className="w-32" disabled>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Saving...
												</Button>
											) : (
												<form.SubmitButton
													className="px-8"
													icon={<Save className="mr-2 h-4 w-4" />}
													label="Save Changes"
												/>
											)}
										</div>
									</div>
								</form.AppForm>
							</form>
						</div>
					</section>

					{/* 2. Security & API Keys Section */}
					<KeyManager
						connectionId={connectionId}
						connectionType={connection.connectionType}
					/>

					{/* 3. Danger Zone */}
					<section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
						<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
							<div>
								<h2 className="font-semibold text-md text-white">
									Danger Zone
								</h2>
								<p className="text-muted-foreground text-xs">
									Permanently remove this connection and all associated data.
								</p>
							</div>
							<Button
								className="px-8 py-6 text-white"
								onClick={handleDelete}
								variant="destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" /> Delete Connection
							</Button>
						</div>
					</section>
				</div>
			</MainContent>
		</div>
	);
};
export default ManageConnection;
