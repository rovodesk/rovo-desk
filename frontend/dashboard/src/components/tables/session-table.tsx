import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
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
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { getDeviceInfo } from "../../../../../packages/auth-old/helpers";
import { useSession } from "../../../../../packages/auth-old/hooks";
import type { DeviceSession } from "../../../../../packages/auth-old/types";

type DeviceSessionWithCurrent = DeviceSession & {
	isCurrent: boolean;
};

export function SessionTable() {
	const { session, deviceSessions, deleteDeviceSession, loading } =
		useSession();
	const currentSessionId = session?.session?.id;

	const sessionsWithCurrent: DeviceSessionWithCurrent[] = deviceSessions.map(
		(s) => ({
			...s,
			isCurrent: s.session.id === currentSessionId,
		})
	);

	if (loading) {
		return (
			<div className="space-y-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	if (!deviceSessions?.length) {
		return (
			<div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
				No active sessions found
			</div>
		);
	}

	return (
		<div className="w-full rounded-xl border bg-card shadow-sm">
			{/* Header */}
			<div className="border-b px-6 py-4">
				<h3 className="font-semibold text-sm">Sessions</h3>
				<p className="text-muted-foreground text-xs">
					Manage sessions used to access your API.
				</p>
			</div>
			{/* Table */}
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="text-center">Device</TableHead>
						<TableHead className="text-left">IP Address</TableHead>
						<TableHead className="text-left">Last Active Date</TableHead>
						<TableHead className="text-left">Last Active At</TableHead>
						<TableHead className="text-left">Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{sessionsWithCurrent.map((session) => {
						const device = getDeviceInfo(session?.session?.userAgent);

						const DeviceIcon = device.Icon;

						const lastActiveDate = new Date(
							session.session.lastActiveAt ?? session.session.createdAt
						)
							.toDateString()
							.split(",")[0];

						const lastActiveTime = new Date(
							session.session.lastActiveAt ?? session.session.createdAt
						)
							.toDateString()
							.split(",")[1];

						return (
							// Row
							<TableRow
								className="group transition-colors hover:bg-muted/40"
								key={session.session.id}
							>
								{/* Device */}
								<TableCell className="flex justify-center px-6">
									<div className="flex items-center gap-3">
										<DeviceIcon className="size-4 text-muted-foreground" />
										<span className="font-medium text-sm">{device.label}</span>
									</div>
								</TableCell>

								{/* IP */}
								<TableCell className="px-2 text-muted-foreground text-sm">
									{session.session.ipAddress}
								</TableCell>

								{/* Date */}
								<TableCell className="px-4 text-muted-foreground text-sm">
									{lastActiveDate}
								</TableCell>

								{/* Time */}
								<TableCell className="justify-center px-4 text-muted-foreground text-sm">
									{session.isCurrent ? (
										<Badge className="ml-2 text-green-500" variant="secondary">
											Active
										</Badge>
									) : (
										lastActiveTime
									)}
								</TableCell>

								{/* Actions */}
								<TableCell className="justify-center pr-6">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="text-destructive hover:bg-destructive/10 disabled:opacity-40"
													disabled={session.isCurrent || loading}
													onClick={() =>
														deleteDeviceSession(session.session.token, {
															onSuccess: () => {
																toast.success("Session revoked");
															},
															onError: () => {
																toast.error("Failed to revoke session", {
																	description: "Please try again later",
																});
															},
														})
													}
													size="icon"
													variant="ghost"
												>
													{loading ? (
														<Loader2Icon
															className={cn(
																"size-4",
																session.isCurrent &&
																	"cursor-not-allowed opacity-40"
															)}
														/>
													) : (
														<Trash2Icon
															className={cn(
																"size-4",
																session.isCurrent &&
																	"cursor-not-allowed opacity-40"
															)}
														/>
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
