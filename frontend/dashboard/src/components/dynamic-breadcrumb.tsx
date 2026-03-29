import { Link, useLocation } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@zero-heads-lab/design-system/components/ui/breadcrumb";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion, type Variants } from "motion/react";
import React from "react";

function formatSegment(segment: string) {
	return segment
		.replace(/-/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Animation variants for the container and children
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08, // The "one after another" delay
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, x: -10 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { type: "spring", stiffness: 300, damping: 24 },
	},
};

export function DynamicBreadcrumb({ className }: { className?: string }) {
	const { pathname } = useLocation();
	const segments = pathname.split("/").filter(Boolean);

	return (
		<Breadcrumb className={cn("flex", className)}>
			<BreadcrumbList className="text-sm">
				<motion.div
					animate="visible"
					className="flex items-center"
					initial="hidden"
					variants={containerVariants}
				>
					{/* Home / Dashboard Link */}
					<motion.div variants={itemVariants}>
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
					</motion.div>

					{segments.map((segment, index) => {
						const to = `/${segments.slice(0, index + 1).join("/")}`;
						const isLast = index === segments.length - 1;

						return (
							<React.Fragment key={to}>
								<motion.div
									className="flex items-center"
									variants={itemVariants}
								>
									<BreadcrumbSeparator className="mx-2 text-muted-foreground" />

									<BreadcrumbItem>
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
								</motion.div>
							</React.Fragment>
						);
					})}
				</motion.div>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
