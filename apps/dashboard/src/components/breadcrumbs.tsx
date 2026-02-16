import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRightIcon, FileTextIcon } from "lucide-react";

export function Breadcrumbs() {
	const matches = useRouterState({
		select: (state) => state.matches,
	});

	const breadcrumbs = matches
		.filter((match) => match.staticData?.breadcrumb)
		.map((match) => {
			const breadcrumb = match.staticData?.breadcrumb;
			const label =
				typeof breadcrumb === "function"
					? breadcrumb(match.params)
					: breadcrumb;

			return {
				label,
				to: match.pathname,
			};
		});

	if (!breadcrumbs.length) return null;

	return (
		<div className="flex items-center gap-2 text-muted-foreground text-sm">
			{breadcrumbs.map((crumb, index) => (
				<div className="flex items-center gap-2" key={crumb.to}>
					<Link
						className="flex items-center gap-2 transition-colors hover:text-foreground"
						to={crumb.to}
					>
						{index === 0 && <FileTextIcon className="size-4 shrink-0" />}
						<span className="hidden sm:inline">{crumb.label}</span>
					</Link>

					{index < breadcrumbs.length - 1 && (
						<ChevronRightIcon className="size-3 shrink-0" />
					)}
				</div>
			))}
		</div>
	);
}
