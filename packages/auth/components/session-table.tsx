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
import { useDeleteSession, useListSessions, useSession } from "../hooks";

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
	const { sessions, isLoading } = useListSessions();
	const { session } = useSession();
	const currentSessionId = session?.session?.id;

	const sessionsWithCurrent = sessions.map((s) => ({
		...s,
		isCurrent: s.id === currentSessionId,
	}));

	const { deleteSession, variables: pendingToken } = useDeleteSession({
		onSuccess: () => {
			toast.success("Session revoked");
		},
		onError: () => {
			toast.error("Failed to revoke session", {
				description: "Please try again later",
			});
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

	if (!sessions?.length) {
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
					{sessionsWithCurrent.map((session) => {
						const device = getDeviceInfo(session.userAgent);
						const DeviceIcon = device.Icon;
						const isDeleting = pendingToken === session.token;

						return (
							<TableRow
								className="group transition-colors hover:bg-muted/40"
								key={sessionsWithCurrent.findIndex((s) => s.id === session.id)}
							>
								{/* Device */}
								<TableCell className="px-6">
									<div className="flex items-center gap-3">
										<DeviceIcon className="size-4 text-muted-foreground" />
										<div className="flex flex-col">
											<span className="font-medium text-sm">
												{device.label}
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
									{new Date(session.createdAt).toLocaleString()}
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
