import { useOrganization } from "@zero-heads-lab/auth/hooks";
import {
	Alert,
	AlertDescription,
} from "@zero-heads-lab/design-system/components/ui/alert";
import { Badge } from "@zero-heads-lab/design-system/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@zero-heads-lab/design-system/components/ui/card";
import { Skeleton } from "@zero-heads-lab/design-system/components/ui/skeleton";
import { Placeholder } from "@zero-heads-lab/shared/lib/utils";
import SectionHeader from "./section-header";
import SectionMain from "./section-main";

export const OrganizationDetails = ({ id }: { id: string }) => {
	const { organization, loading, error } = useOrganization(id);

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-10 w-[300px]" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertDescription>Failed to load organization</AlertDescription>
			</Alert>
		);
	}

	if (!organization) {
		return (
			<Alert>
				<AlertDescription>Organization not found</AlertDescription>
			</Alert>
		);
	}

	const orgIcon =
		organization.logo || Placeholder.logo(organization.name, "shapes");

	return (
		<SectionMain>
			{/* Header */}
			<SectionHeader
				description={organization.slug}
				image={orgIcon}
				title={organization.name}
			>
				<Badge variant="secondary">
					{organization.members?.length ?? 0} Members
				</Badge>
			</SectionHeader>

			<div className="mt-6 flex w-full flex-row gap-4">
				{/* Organization Info */}
				<Card>
					<CardHeader>
						<CardTitle>Organization Info</CardTitle>
					</CardHeader>

					<CardContent className="space-y-2 text-sm">
						<div>
							<span className="text-muted-foreground">ID:</span>{" "}
							{organization.id}
						</div>

						<div>
							<span className="text-muted-foreground">Created:</span>{" "}
							{new Date(organization.createdAt).toLocaleDateString()}
						</div>
					</CardContent>
				</Card>

				{/* Members */}
				<Card>
					<CardHeader>
						<CardTitle>Members</CardTitle>
					</CardHeader>

					<CardContent>
						{organization.members?.length ? (
							<div className="space-y-2">
								{organization.members.map((member) => (
									<div
										className="flex items-center justify-between rounded-md border px-3 py-2"
										key={member.id}
									>
										<div>
											<div className="font-medium">{member.user?.name}</div>
											<div className="text-muted-foreground text-xs">
												{member.user?.email}
											</div>
										</div>

										<Badge>{member.role}</Badge>
									</div>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-sm">
								No members in this organization
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</SectionMain>
	);
};
