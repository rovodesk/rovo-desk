import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@zero-heads-lab/auth/client";
import type { AuthSession } from "@zero-heads-lab/auth/types";
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
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import {
	Loader2Icon,
	MonitorIcon,
	SmartphoneIcon,
	Trash2Icon,
} from "lucide-react";
import { useMemo } from "react";
import { authQueries } from "@/lib/queries/auth.queries";

function getDeviceInfo(userAgent?: string) {
	if (!userAgent) {
		return { label: "Unknown device", Icon: MonitorIcon };
	}

	const ua = userAgent.toLowerCase();
	const isMobile =
		ua.includes("iphone") || ua.includes("android") || ua.includes("mobile");

	return {
		label: isMobile ? "Mobile device" : "Desktop device",
		Icon: isMobile ? SmartphoneIcon : MonitorIcon,
	};
}

export function SessionTable() {
	const sessionListQuery = authQueries.sessionList();
	const { data: sessions, isLoading } = useQuery(sessionListQuery);
	const { data: activeSession } = useQuery(authQueries.session());

	const queryClient = useQueryClient();
	const activeSessionId = activeSession?.session?.id;

	const sessionsData = useMemo(() => {
		return sessions?.map((session) => ({
			...session,
			isCurrent: session.id === activeSessionId,
			device: getDeviceInfo(session.userAgent ?? undefined),
		}));
	}, [sessions, activeSessionId]);

	const { mutate: deleteSession, variables: pendingToken } = useMutation({
		mutationFn: async (sessionToken: string) =>
			authClient.revokeSession({ token: sessionToken }),

		onMutate: async (sessionToken) => {
			await queryClient.cancelQueries({ queryKey: sessionListQuery.queryKey });

			const previousSessions = queryClient.getQueryData<AuthSession[]>(
				sessionListQuery.queryKey
			);

			queryClient.setQueryData(sessionListQuery.queryKey, (old) =>
				old?.filter((s) => s.token !== sessionToken)
			);

			return { previousSessions };
		},

		onError: (_err, _token, context) => {
			if (context?.previousSessions) {
				queryClient.setQueryData(
					sessionListQuery.queryKey,
					context.previousSessions
				);
			}

			toast.error("Failed to revoke session", {
				description: "Please try again later",
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: sessionListQuery.queryKey });
		},

		onSuccess: () => {
			toast.success("Session revoked");
		},
	});

	if (isLoading) {
		return (
			<div className="space-y-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	if (!sessionsData?.length) {
		return (
			<div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
				No active sessions found
			</div>
		);
	}

	return (
		<div className="w-full rounded-xl border bg-card shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="px-6">Device</TableHead>
						<TableHead>IP Address</TableHead>
						<TableHead>Last Active</TableHead>
						<TableHead className="w-[120px] pr-6 text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{sessionsData.map((session) => {
						const DeviceIcon = session.device.Icon;
						const isDeleting = pendingToken === session.token;

						return (
							<TableRow
								className="group transition-colors hover:bg-muted/40"
								key={session.id}
							>
								{/* Device */}
								<TableCell className="px-6">
									<div className="flex items-center gap-3">
										<DeviceIcon className="size-4 text-muted-foreground" />
										<div className="flex flex-col">
											<span className="font-medium text-sm">
												{session.device.label}
											</span>
											{session.isCurrent && (
												<span className="font-bold text-[10px] text-emerald-500 uppercase tracking-wider">
													Active Now
												</span>
											)}
										</div>
									</div>
								</TableCell>

								{/* IP */}
								<TableCell className="text-muted-foreground text-sm">
									{session.ipAddress}
								</TableCell>

								{/* Last active */}
								<TableCell className="text-muted-foreground text-sm">
									{session.createdAt.toLocaleString()}
								</TableCell>

								{/* Actions */}
								<TableCell className="pr-6 text-right">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="text-destructive hover:bg-destructive/10 disabled:opacity-40"
													disabled={session.isCurrent || isDeleting}
													onClick={() => deleteSession(session.token)}
													size="icon"
													variant="ghost"
												>
													{isDeleting ? (
														<Loader2Icon className="size-4 animate-spin" />
													) : (
														<Trash2Icon className="size-4" />
													)}
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												{session.isCurrent
													? "You can't remove the current session"
													: "Revoke session"}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
