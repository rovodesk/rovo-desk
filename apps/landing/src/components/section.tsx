import type React from "react";

const Section = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<section className="relative z-10 mx-auto grid h-[calc(100vh-80px)] max-w-full grid-cols-1 items-center bg-slate-900 px-6 pt-24 lg:grid-cols-2 lg:gap-24 lg:px-8" />
	);
};

export default Section;
