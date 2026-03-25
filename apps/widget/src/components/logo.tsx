import type * as React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
	title?: string;
	size?: number;
}

export function Logo({
	className,
	size = 10,
	title = "RovoDesk",
	...props
}: LogoProps) {
	return (
		<svg
			aria-label={title}
			className={`h-${size} w-${size}`}
			fill="transparent"
			role="img"
			viewBox="16 16 32 32"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{title && <title>{title}</title>}

			{/* Minimal R mark */}
			<path
				className="stroke-current"
				d="M22 18H36
           C42 18 46 21 46 26
           C46 31 42 34 36 34
           H22
           M36 34L46 46"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="3"
			/>
		</svg>
	);
}

export default Logo;
