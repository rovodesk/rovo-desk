import { Link } from "@tanstack/react-router";
import Logo from "@zero-heads-lab/design-system/components/logo";
import { ThemeSwitch } from "@zero-heads-lab/design-system/components/theme-switch";
import { HomeIcon } from "lucide-react";

export function Header() {
	return (
		<header className="sticky top-0 z-40 border-border border-b bg-background/80 backdrop-blur-xl">
			<div className="container mx-auto flex h-16 items-center justify-between px-6">
				<div className="group flex cursor-pointer items-center gap-2">
					<Link className="flex gap-2" to="/">
						<Logo className="h-7 w-auto transition-transform group-hover:scale-110" />
						<span className="font-bold text-lg tracking-tight">Rovodesk</span>
					</Link>
				</div>
				<nav className="flex items-center gap-6">
					<Link
						className="font-semibold text-muted-foreground text-sm hover:text-blue-600"
						to="/"
					>
						<HomeIcon className="h-5 w-5" />
					</Link>
					<ThemeSwitch />
				</nav>
			</div>
		</header>
	);
}
