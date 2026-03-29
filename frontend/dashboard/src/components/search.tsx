//TODO: Move this to a dedicated package

import { Button } from "@zero-heads-lab/design-system/components/ui/button";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { SearchIcon } from "lucide-react";
import { useSearch } from "@/providers/search";

interface SearchProps {
	className?: string;
	type?: React.HTMLInputTypeAttribute;
	placeholder?: string;
	disabled?: boolean;
}

export function Search({
	className = "",
	placeholder = "Search",
	disabled,
}: SearchProps) {
	const { setOpen } = useSearch();
	return (
		<Button
			animated={false}
			className={cn(
				"group relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 font-normal text-muted-foreground text-sm shadow-none hover:bg-accent sm:w-54 sm:pe-12 md:flex-none lg:w-64 xl:w-100",
				className
			)}
			disabled={disabled}
			onClick={() => setOpen(true)}
			variant="outline"
		>
			<SearchIcon
				aria-hidden="true"
				className="absolute start-1.5 top-1/2 -translate-y-1/2"
				size={16}
			/>
			<span className="ms-4">{placeholder}</span>
			<kbd className="pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded-sm border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 group-hover:bg-accent sm:flex">
				<span className="text-xs">⌘</span>K
			</kbd>
		</Button>
	);
}
