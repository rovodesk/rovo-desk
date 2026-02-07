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

<<<<<<< HEAD

import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { useDeleteDeviceSession, useListDeviceSessions } from "../hooks";
import type { DeviceSession } from "../types";

type DeviceSessionWithCurrent = DeviceSession & {
	isCurrent: boolean;
};

export function SessionTable() {
	const { deviceSessions, isLoading: isSessionsLoading } =
		useListDeviceSessions();
	const { session, isLoading: isSessionLoading } = useSession();
	const currentSessionId = session?.session?.id;

	const sessionsWithCurrent: DeviceSessionWithCurrent[] = deviceSessions.map(
		(s) => ({
			...s,
			isCurrent: s.session.id === currentSessionId,
		})
	);

	const {
		deleteSession,
		isPending: isDeletingSession,
		pendingToken,
	} = useDeleteDeviceSession({
=======
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
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
		onSuccess: () => {
			toast.success("Session revoked");
		},
		onError: () => {
			toast.error("Failed to revoke session", {
				description: "Please try again later",
			});
		},
	});

<<<<<<< HEAD
	if (isSessionsLoading || isSessionLoading) {
=======
	if (isLoading) {
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
		return (
			<div className="space-y-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

<<<<<<< HEAD
	if (!deviceSessions?.length) {
=======
	if (!sessions?.length) {
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
		return (
			<div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
				No active sessions found
			</div>
		);
	}

	return (
		<div className="w-full rounded-xl border bg-card shadow-sm">
			<Table>
<<<<<<< HEAD
				{/* Header */}
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="text-center">Device</TableHead>
						<TableHead className="text-left">IP Address</TableHead>
						<TableHead className="text-left">Last Active Date</TableHead>
						<TableHead className="text-left">Last Active At</TableHead>
						<TableHead className="text-left">Actions</TableHead>
					</TableRow>
				</TableHeader>

				{/* Body */}
				<TableBody>
					{sessionsWithCurrent.map((session) => {
						const device = getDeviceInfo(session?.session?.userAgent);

						const DeviceIcon = device.Icon;

						const isDeleting =
							pendingToken === session.session.token && isDeletingSession;

						const lastActiveDate = new Date(
							session.session.lastActiveAt ?? session.session.createdAt
						)
							.toLocaleString()
							.split(",")[0];

						const lastActiveTime = new Date(
							session.session.lastActiveAt ?? session.session.createdAt
						)
							.toLocaleString()
							.split(",")[1];

						return (
							// Row
							<TableRow
								className="group transition-colors hover:bg-muted/40"
								key={session.session.id}
							>
								{/* Device */}
								<TableCell className="flex justify-center px-6">
=======
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
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
<<<<<<< HEAD
								<TableCell className="px-2 text-muted-foreground text-sm">
									{session.session.ipAddress}
								</TableCell>

								{/* Date */}
								<TableCell className="px-4 text-muted-foreground text-sm">
									{lastActiveDate}
								</TableCell>

								{/* Time */}
								<TableCell className="px-4 text-muted-foreground text-sm">
									{lastActiveTime}
								</TableCell>

								{/* Actions */}
								<TableCell className="justify-center pr-6">
=======
								<TableCell className="text-muted-foreground text-sm">
									{session.ipAddress}
								</TableCell>

								{/* Last active */}
								<TableCell className="text-muted-foreground text-sm">
									{new Date(session.createdAt).toLocaleString()}
								</TableCell>

								{/* Actions */}
								<TableCell className="pr-6 text-right">
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													className="text-destructive hover:bg-destructive/10 disabled:opacity-40"
													disabled={session.isCurrent || isDeleting}
<<<<<<< HEAD
													onClick={() => deleteSession(session.session.token)}
													size="icon"
													variant="ghost"
												>
													{isDeleting &&
													pendingToken === session.session.token ? (
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
=======
													onClick={() => deleteSession(session.token)}
													size="icon"
													variant="ghost"
												>
													{isDeleting ? (
														<Loader2Icon className="size-4 animate-spin" />
													) : (
														<Trash2Icon className="size-4" />
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)
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
