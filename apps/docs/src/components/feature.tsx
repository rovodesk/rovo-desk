import { Link } from "@tanstack/react-router";

export function Feature({
	title,
	description,
	linkText,
}: {
	title: string;
	description: string;
	linkText: string;
}) {
	return (
		<div>
			<h3 className="cursor-pointer font-medium text-primary text-xl hover:underline">
				{title}
			</h3>

			<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
				{description}
			</p>

			<div className="mt-4">
				<Link
					className="font-medium text-primary text-sm hover:underline"
					params={{ _splat: "" }}
					to="/docs/$"
				>
					{linkText}
				</Link>
			</div>
		</div>
	);
}
