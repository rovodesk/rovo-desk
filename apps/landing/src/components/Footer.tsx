import { Link } from "@tanstack/react-router";
import Logo from "@zero-heads-lab/design-system/components/logo";
import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { useTheme } from "@zero-heads-lab/design-system/hooks/use-theme";
import {
	ArrowRight,
	Github,
	Linkedin,
	MessageCircle,
	Moon,
	Sun,
	Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";

const data = () => ({
	navigation: {
		product: [
			{ name: "Features", href: "#features" },
			{ name: "Pricing", href: "#pricing" },
			{ name: "Integrations", href: "#integrations" },
			{ name: "Roadmap", href: "#roadmap" },
		],
		company: [
			{ name: "About", href: "/about" },
			{ name: "Blog", href: "/blog" },
			{ name: "Careers", href: "/careers" },
			{ name: "Contact", href: "/contact" },
		],
		resources: [
			{ name: "Documentation", href: "/docs" },
			{ name: "API Reference", href: "/api" },
			{ name: "Community", href: "/community" },
			{ name: "Status", href: "/status" },
		],
		legal: [
			{ name: "Privacy", href: "/privacy" },
			{ name: "Terms", href: "/terms" },
			{ name: "Cookie Policy", href: "/cookies" },
		],
	},
	socialLinks: [
		{ icon: Twitter, label: "Twitter", href: "#" },
		{ icon: Github, label: "GitHub", href: "#" },
		{ icon: MessageCircle, label: "Discord", href: "#" },
		{ icon: Linkedin, label: "LinkedIn", href: "#" },
	],
	bottomLinks: [
		{ href: "/privacy", label: "Privacy Policy" },
		{ href: "/terms", label: "Terms of Service" },
		{ href: "/cookies", label: "Cookie Policy" },
	],
});

export default function Footer() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const currentYear = new Date().getFullYear();
	if (!mounted) return null;

	return (
		<footer className="w-full border-t bg-background pt-16">
			<div className="container mx-auto px-6">
				<div className="grid grid-cols-1 gap-12 pb-12 lg:grid-cols-12">
					{/* Left Side: Brand & Newsletter */}
					<div className="space-y-8 lg:col-span-4">
						<div className="flex flex-col gap-4">
							<Link className="flex items-center gap-2" to="/">
								<Logo className="h-8 w-8" />
								<span className="font-bold text-xl tracking-tight">
									Rovo Desk
								</span>
							</Link>
							<p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
								Empowering modern enterprises with scalable, high-performance
								desk solutions. Built for the future of work.
							</p>
						</div>

						<div className="space-y-4">
							<h4 className="font-semibold text-sm">Subscribe to updates</h4>
							<div className="flex max-w-sm gap-2">
								<Input
									className="border! rounded-md! bg-muted! focus-visible:ring-1!"
									placeholder="work@email.com"
								/>
								<button className="flex h-8 items-center justify-center whitespace-nowrap rounded-lg bg-blue-600 px-6 py-2 font-semibold text-sm text-white transition-colors hover:bg-blue-700">
									Join
									<ArrowRight className="ml-1 h-3 w-3" />
								</button>
							</div>
						</div>

						<div className="flex gap-3">
							{data().socialLinks.map(({ icon: Icon, label, href }) => (
								<Link
									className="text-muted-foreground transition-colors hover:text-primary"
									key={label}
									to={href}
								>
									<Icon className="size-5" />
								</Link>
							))}
							<button
								className="ml-2 border-l pl-4 text-muted-foreground transition-colors hover:text-primary"
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							>
								{theme === "dark" ? (
									<Sun className="size-5" />
								) : (
									<Moon className="size-5" />
								)}
							</button>
						</div>
					</div>

					{/* Right Side: Links Grid */}
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-8">
						{(["product", "company", "resources", "legal"] as const).map(
							(section) => (
								<div className="flex flex-col gap-4" key={section}>
									<h3 className="font-semibold text-foreground/70 text-sm uppercase tracking-widest">
										{section}
									</h3>
									<ul className="flex flex-col gap-3">
										{data().navigation[section].map((item) => (
											<li key={item.name}>
												<Link
													className="text-muted-foreground text-sm transition-colors hover:text-foreground"
													to={item.href}
												>
													{item.name}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)
						)}
					</div>
				</div>

				{/* The "Enterprise" Faded Header Section */}
				<div className="relative overflow-hidden border-t py-12">
					<div className="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
						<p className="text-muted-foreground text-xs">
							© {currentYear} Rovo Desk Inc. All rights reserved.
						</p>
						<div className="flex gap-6 text-muted-foreground text-xs">
							{data().bottomLinks.map((link) => (
								<Link
									className="hover:text-foreground"
									key={link.label}
									to={link.href}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>

					{/* Background Faded Text */}
					<h1 className="pointer-events-none absolute right-0 -bottom-6 left-0 select-none bg-linear-to-b from-foreground/5 to-transparent bg-clip-text text-center font-bold text-[12vw] text-transparent leading-none opacity-50 dark:from-white/10">
						ROVO DESK
					</h1>
				</div>
			</div>
		</footer>
	);
}
