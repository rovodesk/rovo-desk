import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zero-heads-lab/design-system/components/empty";
import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@zero-heads-lab/design-system/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { ArrowUpRightIcon, Key, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useApiKeys } from "../hooks/use-apikey";
import { CreateApiKeyDialog } from "./create-api-key-dialog";

export function ApiKeyTable() {
	const { apiKeys, isLoading, deleteApiKey } = useApiKeys();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleDeleteApiKey = (keyId: string) => {
		deleteApiKey({ keyId });
	};

	if (isLoading) {
		return <ApiKeyTableSkeleton />;
	}

	if (!apiKeys || apiKeys.length === 0) {
		return (
			<>
				<Empty className="rounded-xl border">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Key />
						</EmptyMedia>

						<EmptyTitle>No API Keys</EmptyTitle>

						<EmptyDescription>
							You haven't created any API keys yet. Create one to start using
							the API.
						</EmptyDescription>
					</EmptyHeader>

					<EmptyContent className="flex-row justify-center gap-2">
						<Button onClick={() => setIsDialogOpen(true)}>
							<PlusIcon className="mr-2 size-4" />
							Create API Key
						</Button>

						<Button asChild className="text-muted-foreground" variant="ghost">
							<a href="/">
								Learn More <ArrowUpRightIcon className="ml-1 size-4" />
							</a>
						</Button>
					</EmptyContent>
				</Empty>

				<CreateApiKeyDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
			</>
		);
	}

	return (
		<div className="w-full rounded-xl border bg-card shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between border-b px-6 py-4">
				<div>
					<h3 className="font-semibold text-sm">API Keys</h3>
					<p className="text-muted-foreground text-xs">
						Manage keys used to access your API.
					</p>
				</div>

				<Button onClick={() => setIsDialogOpen(true)} size="sm">
					<PlusIcon className="mr-2 size-4" />
					Create API Key
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="text-center">Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Last Used</TableHead>
						<TableHead className="text-left">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{apiKeys.map((key) => {
						const created = new Date(key.createdAt).toLocaleDateString();
						const lastUsed = key.lastRequest
							? new Date(key.lastRequest).toLocaleDateString()
							: "Never";

						return (
							<TableRow
								className="group transition-colors hover:bg-muted/40"
								key={key.id}
							>
								<TableCell className="flex justify-center">
									<div className="flex items-center gap-2">
										<Key className="size-4 text-muted-foreground" />
										{key.name}
									</div>
								</TableCell>

								<TableCell className="truncate text-muted-foreground text-sm">
									{key.metadata?.description || "No description"}
								</TableCell>

								<TableCell className="text-muted-foreground text-sm">
									{created}
								</TableCell>

								<TableCell className="text-muted-foreground text-sm">
									{lastUsed}
								</TableCell>

								<TableCell className="flex justify-start">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="text-destructive hover:bg-destructive/10"
													onClick={() => handleDeleteApiKey(key.id)}
													size="icon"
													variant="ghost"
												>
													<Trash2Icon className="size-4" />
												</Button>
											</TooltipTrigger>

											<TooltipContent>Revoke API Key</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			<CreateApiKeyDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
		</div>
	);
}

export function ApiKeyTableSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-12 w-full" />
		</div>
	);
}
