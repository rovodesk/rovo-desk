import type * as React from "react";
import { cn } from "@/utilities/ui";

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				"rounded-lg border bg-card text-card-foreground shadow-sm",
				className
			)}
			data-slot="card"
			{...props}
		/>
	);
};

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn("flex flex-col gap-1.5 p-6", className)}
			data-slot="card-header"
			{...props}
		/>
	);
};

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
	className,
	...props
}) => {
	return (
		<h3
			className={cn(
				"font-semibold text-2xl leading-none tracking-tight",
				className
			)}
			data-slot="card-title"
			{...props}
		/>
	);
};

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
	className,
	...props
}) => {
	return (
		<p
			className={cn("text-muted-foreground text-sm", className)}
			data-slot="card-description"
			{...props}
		/>
	);
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn("p-6 pt-0", className)}
			data-slot="card-content"
			{...props}
		/>
	);
};

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn("flex items-center p-6 pt-0", className)}
			data-slot="card-footer"
			{...props}
		/>
	);
};

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
};
