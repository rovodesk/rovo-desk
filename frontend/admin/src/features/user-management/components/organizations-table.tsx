import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearch } from "@tanstack/react-router";
import { AddDomainDialog } from "@zero-heads-lab/auth/components/add-domain-dialog";
import type { ORGANIZATION } from "@zero-heads-lab/contract/lib/dto/auth.dto";
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
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@zero-heads-lab/design-system/components/ui/pagination";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@zero-heads-lab/design-system/components/ui/table";
import { formatDateTime } from "@zero-heads-lab/shared/utils";
import { Search, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { z } from "zod";
import { orpcQuery, type RPCOutputs } from "@/lib/orpc-client";

const LIMIT = 10;

export interface ListOrganizationsParams {
	slug?: string;
	page?: number;
	limit?: number;
}

type ListOrganizationsResponse = RPCOutputs["organization"]["list"];
type Organization = z.infer<typeof ORGANIZATION>;

export function OrganizationsTable() {
	const router = useRouter();
	const { slug = "", page = 1 } = useSearch({
		from: "/_authenticated/user-management/organizations",
	});

	const [searchSlug, setSearchSlug] = useState(slug);
	const [isAddOrganizationDialogOpen, setIsAddOrganizationDialogOpen] =
		useState(false);

	/* ---------------- navigation helper ---------------- */

	const navigate = (updates: Partial<{ slug: string; page: number }>) =>
		router.navigate({
			to: "/user-management/organizations",
			search: (prev) => ({
				slug: updates.slug ?? prev.slug ?? "",
				page: updates.page ?? prev.page ?? 1,
			}),
			replace: true,
		});

	/* ---------------- debounce ---------------- */

	// biome-ignore lint/correctness/useExhaustiveDependencies: navigate will cause unnecessary rerenders
	useEffect(() => {
		const timer = setTimeout(() => {
			navigate({ slug: searchSlug, page: 1 });
		}, 350);

		return () => clearTimeout(timer);
	}, [searchSlug]);

	const listOrganizationsQueryOptions = ({
		slug,
		page,
	}: ListOrganizationsParams) => {
		return orpcQuery.admin.organization.list.queryOptions({
			queryKey: ["organizations", { slug, page }],
			input: {
				slug,
				page,
				limit: LIMIT,
			},
		});
	};

	const { data, error, isLoading, isFetching } =
		useQuery<ListOrganizationsResponse>(
			listOrganizationsQueryOptions({ slug, page })
		);

	/* ---------------- derived data ---------------- */

	const organizations = data?.data ?? [];
	const total = data?.meta?.total ?? 0;

	const totalPages = useMemo(() => {
		if (!data) return 1;
		return Math.ceil(data.meta.total / LIMIT);
	}, [data]);

	/* ---------------- filter UI ---------------- */

	const filters = (
		<div className="flex flex-wrap items-end justify-between gap-2">
			<div className="flex gap-2">
				<div className="relative">
					<Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

					<input
						className="w-[220px] rounded-md border bg-background py-2 pr-2 pl-8 text-sm"
						onChange={(e) => setSearchSlug(e.target.value)}
						placeholder="Search slug..."
						value={searchSlug}
					/>
				</div>
			</div>

			<button
				className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
				onClick={() => setIsAddOrganizationDialogOpen(true)}
			>
				<UserPlus className="h-4 w-4" />
				Add Organization
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
				<AlertTitle>Failed to load organizations</AlertTitle>
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
							: organizations.map((org: Organization) => (
								<TableRow
									key={org.id}
									onClick={() =>
										router.navigate({
											to: "/user-management/details/$organizationId",
											params: { organizationId: org.id },
										})
									}
								>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage src={org.logo ?? ""} />
												<AvatarFallback>
													{org.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>

											<div>
												<div className="font-medium text-sm">{org.name}</div>
												<div className="text-muted-foreground text-xs">
													{org.slug}
												</div>
											</div>
										</div>
									</TableCell>

									{/* <TableCell>
                                        {org.domainVerified ? (
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
                                    </TableCell> */}

									<TableCell className="text-muted-foreground text-xs">
										{formatDateTime(org.createdAt, "date")}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-muted-foreground text-sm">
					Showing {organizations.length} of {total} users
				</span>

				{pagination}

				{isFetching && (
					<span className="text-muted-foreground text-xs">Updating...</span>
				)}
			</div>

			<AddDomainDialog
				isOpen={isAddOrganizationDialogOpen}
				onOpenChange={(value) => setIsAddOrganizationDialogOpen(value)}
				onSuccess={() => {
					navigate({ page: 1 });
				}}
				skipInviteStep
			/>
		</div>
	);
}
