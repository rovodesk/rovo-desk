import { useRouter, useSearch } from "@tanstack/react-router";
import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import { useAdmin } from "@zero-heads-lab/auth/hooks";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@zero-heads-lab/design-system/components/ui/alert";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@zero-heads-lab/design-system/components/ui/avatar";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@zero-heads-lab/design-system/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@zero-heads-lab/design-system/components/ui/select";
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
	TooltipTrigger,
} from "@zero-heads-lab/design-system/components/ui/tooltip";
import { formatDateTime } from "@zero-heads-lab/shared/lib/utils";
import {
	Ban,
	Check,
	CheckCircle,
	Search,
	Shield,
	User,
	UserPlus,
	XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UserAddDialog } from "./add-user-dialog";

const LIMIT = 10;

export function UsersTable() {
	const router = useRouter();

	const {
		role = "all",
		email = "",
		page = 1,
	} = useSearch({
		from: "/_authenticated/user-management/",
	});

	const [searchEmail, setSearchEmail] = useState(email);
	const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

	/* ---------------- navigation helper ---------------- */

	const navigate = (
		updates: Partial<{
			role: AuthRole | "all";
			email: string;
			page: number;
		}>
	) =>
		router.navigate({
			to: "/user-management",
			search: (prev) => ({
				role: updates.role ?? prev.role ?? "all",
				email: updates.email ?? prev.email ?? "",
				page: updates.page ?? prev.page ?? 1,
			}),
			replace: true,
		});
	/* ---------------- debounce email ---------------- */

	// biome-ignore lint/correctness/useExhaustiveDependencies: navigate will cause unnecessary rerenders
	useEffect(() => {
		const timer = setTimeout(() => {
			navigate({ email: searchEmail, page: 1 });
		}, 350);

		return () => clearTimeout(timer);
	}, [searchEmail]);

	const { useListUsers } = useAdmin();
	const { data, error, isLoading, isFetching } = useListUsers({
		role,
		email,
		page,
	});

	/* ---------------- derived data ---------------- */

	const users = data?.users ?? [];
	const total = data?.total ?? 0;

	const totalPages = useMemo(() => {
		if (!data) return 1;
		return Math.ceil(data.total / LIMIT);
	}, [data]);

	/* ---------------- filter UI ---------------- */

	const filters = (
		<div className="flex flex-wrap items-end justify-between gap-2">
			<div className="flex gap-2">
				<div className="relative">
					<Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

					<input
						className="w-[220px] rounded-md border bg-background py-2 pr-2 pl-8 text-sm"
						onChange={(e) => setSearchEmail(e.target.value)}
						placeholder="Search email..."
						value={searchEmail}
					/>
				</div>

				<Select
					defaultValue={role}
					onValueChange={(v) =>
						navigate({ role: v as AuthRole | "all", page: 1 })
					}
				>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Select role" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="all">All</SelectItem>

						<SelectSeparator />

						<SelectGroup>
							<SelectLabel>Clients</SelectLabel>
							<SelectItem value="owner">Owner</SelectItem>
							<SelectItem value="member">Member</SelectItem>
						</SelectGroup>

						<SelectSeparator />

						<SelectGroup>
							<SelectLabel>Internal</SelectLabel>
							<SelectItem value="demoUser">Demo User</SelectItem>
							<SelectItem value="betaUser">Beta User</SelectItem>
						</SelectGroup>

						<SelectSeparator />

						<SelectGroup>
							<SelectItem value="user">User</SelectItem>
							<SelectItem value="admin">Admin</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>

			<button
				className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
				onClick={() => setIsAddUserDialogOpen(true)}
			>
				<UserPlus className="h-4 w-4" />
				Add user
			</button>
		</div>
	);

	/* ---------------- pagination ---------------- */

	const pagination = (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						className={page === 1 ? "pointer-events-none opacity-50" : ""}
						onClick={() => navigate({ page: Math.max(1, page - 1) })}
					/>
				</PaginationItem>

				{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
					<PaginationItem key={p}>
						<PaginationLink
							isActive={p === page}
							onClick={() => navigate({ page: p })}
						>
							{p}
						</PaginationLink>
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						className={
							page === totalPages ? "pointer-events-none opacity-50" : ""
						}
						onClick={() => navigate({ page: Math.min(totalPages, page + 1) })}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);

	/* ---------------- error ---------------- */

	if (error) {
		return (
			<Alert>
				<AlertTitle>Failed to load users</AlertTitle>
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
		);
	}

	/* ---------------- render ---------------- */

	return (
		<div className="space-y-4">
			{filters}

			<div className="overflow-hidden rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Verification</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Created</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading
							? Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i}>
										<TableCell>
											<Skeleton className="h-10 w-40" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-5 w-20" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-5 w-20" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-5 w-20" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-5 w-24" />
										</TableCell>
									</TableRow>
								))
							: users.map((user) => (
									<TableRow
										key={user.id}
										onClick={() =>
											router.navigate({
												to: "/user-management/details/$userId",
												params: { userId: user.id },
											})
										}
									>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar>
													<AvatarImage src={user.image ?? ""} />
													<AvatarFallback>
														{user.name.slice(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>

												<div>
													<div className="font-medium text-sm">{user.name}</div>
													<div className="text-muted-foreground text-xs">
														{user.email}
													</div>
												</div>
											</div>
										</TableCell>

										<TableCell>
											{user.emailVerified ? (
												<Badge variant="outline">
													<CheckCircle className="mr-1 h-3 w-3" />
													Verified
												</Badge>
											) : (
												<Badge variant="outline">
													<XCircle className="mr-1 h-3 w-3" />
													Unverified
												</Badge>
											)}
										</TableCell>

										<TableCell>
											<Badge variant="outline">
												{user.role === "admin" ? (
													<Shield className="mr-1 h-3 w-3" />
												) : (
													<User className="mr-1 h-3 w-3" />
												)}
												{user.role}
											</Badge>
										</TableCell>

										<TableCell>
											{user.banned ? (
												<Tooltip>
													<TooltipTrigger asChild>
														<Badge variant="destructive">
															<Ban className="mr-1 h-3 w-3" />
															Banned
														</Badge>
													</TooltipTrigger>

													<TooltipContent>
														{user.banReason ?? "No reason provided"}
													</TooltipContent>
												</Tooltip>
											) : (
												<Badge variant="outline">
													<Check className="mr-1 h-3 w-3" />
													Active
												</Badge>
											)}
										</TableCell>

										<TableCell className="text-muted-foreground text-xs">
											{formatDateTime(user.createdAt, "date")}
										</TableCell>
									</TableRow>
								))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm">
					Showing {users.length} of {total} users
				</span>

				{pagination}

				{isFetching && (
					<span className="text-muted-foreground text-xs">Updating...</span>
				)}
			</div>

			<UserAddDialog
				isOpen={isAddUserDialogOpen}
				onClose={() => setIsAddUserDialogOpen(false)}
				onSuccess={() => {
					navigate({ page: 1 });
				}}
			/>
		</div>
	);
}
