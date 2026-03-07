"use client";

import { Link, useLocation } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@zero-heads-lab/design-system/components/ui/breadcrumb";

function formatSegment(segment: string) {
	return segment
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DynamicBreadcrumb() {
	const { pathname } = useLocation();
	const segments = pathname.split("/").filter(Boolean);

	return (
		<Breadcrumb>
			<BreadcrumbList className="text-sm">
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							className="text-muted-foreground text-sm transition-colors hover:text-foreground"
							to="/"
						>
							Dashboard
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{segments.map((segment, index) => {
					const to = `/${segments.slice(0, index + 1).join("/")}`;
					const isLast = index === segments.length - 1;

					return (
						<>
							<BreadcrumbSeparator className="mx-2 text-muted-foreground" />

							<BreadcrumbItem key={to}>
								{isLast ? (
									<BreadcrumbPage className="font-medium text-foreground text-sm">
										{formatSegment(segment)}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link
											className="truncate text-muted-foreground text-sm transition-colors hover:text-foreground"
											to={to}
										>
											{formatSegment(segment)}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
