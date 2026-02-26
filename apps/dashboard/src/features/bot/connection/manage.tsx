import { useQuery } from "@tanstack/react-query";
import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useAppForm } from "@zero-heads-lab/design-system/components/form";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { ChevronLeft, Save, Trash2 } from "lucide-react";
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
	} = useChatbot();

	const { data: connection, isLoading } = useQuery(
		getConnectionQueryOptions(connectionId)
	);

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
						<ConnectionIcon
							className="h-8 w-8"
							iconKey={connection?.connectionIcon}
						/>
						<h1 className="font-bold text-xl tracking-tight">
							{connection?.connectionName}
						</h1>
						<Badge variant="secondary">{connection?.connectionType}</Badge>
					</div>
				</div>
			</Header>

			<MainContent>
				<div className="mx-auto mt-6 max-w-4xl space-y-8">
					{/* 1. Identity & Configuration Section */}
					<section className="rounded-2xl border bg-card p-6 shadow-sm">
						<div className="mb-6">
							<h2 className="font-semibold text-lg">General Settings</h2>
							<p className="text-muted-foreground text-sm">
								Update the connection identity and endpoint.
							</p>
						</div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit(e);
							}}
						>
							<form.AppForm>
								<div className="grid gap-6 md:grid-cols-2">
									<div className="space-y-4">
										<form.AppField
											children={(field) => (
												<field.TextField
													defaultValue={connection?.connectionName}
													label="Connection Name"
												/>
											)}
											name="connectionName"
										/>
										<form.AppField
											children={(field) => (
												<field.TextField
													defaultValue={connection?.connectionType}
													disabled
													label="Connection Type"
												/>
											)}
											name="connectionType"
										/>
									</div>

									<form.AppField
										children={(field) => (
											<field.TextField
												defaultValue={connection?.connectionSource}
												label="Source"
											/>
										)}
										name="connectionSource"
									/>
								</div>

								<div className="mt-6 flex justify-end">
									{isLoading ? (
										<Skeleton className="h-10 w-32" />
									) : (
										<form.SubmitButton
											icon={<Save className="mr-2 h-4 w-4" />}
											label="Save Changes"
										/>
									)}
								</div>
							</form.AppForm>
						</form>
					</section>

					{/* 2. Security & API Keys Section */}
					<KeyManager
						connectionId={connectionId}
						connectionType={connection?.connectionType}
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
