import Logo from "@zero-heads-lab/design-system/components/logo";
import { cn } from "@zero-heads-lab/design-system/lib/utils";
import {
	ArrowRight,
	BarChart,
	BookOpen,
	ChevronDown,
	Code,
	FileText,
	type LucideIcon,
	Menu,
	Palette,
	Play,
	Shield,
	Sparkle,
	Video,
	X,
	Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type MenuItem = {
	icon?: LucideIcon;
	label: string;
	description?: string;
	href: string;
};

const coreFeatures: MenuItem[] = [
	{
		icon: Sparkle,
		label: "AI Assistant",
		description: "Intelligent code suggestions",
		href: "#",
	},
	{
		icon: Code,
		label: "Code Editor",
		description: "Advanced syntax highlighting",
		href: "#",
	},
	{
		icon: Palette,
		label: "Design Tools",
		description: "Visual design system builder",
		href: "#",
	},
];

const advancedFeatures: MenuItem[] = [
	{
		icon: BarChart,
		label: "Analytics",
		description: "Real-time performance insights",
		href: "#",
	},
	{
		icon: Shield,
		label: "Security",
		description: "Enterprise-grade protection",
		href: "#",
	},
	{
		icon: Zap,
		label: "Automation",
		description: "Workflow automation tools",
		href: "#",
	},
];

const resources: MenuItem[] = [
	{ icon: FileText, label: "Documentation", href: "#" },
	{ icon: Video, label: "Video Tutorials", href: "#" },
	{ icon: BookOpen, label: "Guides", href: "#" },
];

const company: MenuItem[] = [
	{ label: "About", href: "#" },
	{ label: "Blog", href: "#" },
	{ label: "Careers", href: "#" },
];

const menuConfig = {
	Product: { core: coreFeatures, advanced: advancedFeatures },
	Solutions: { resources, company },
};

const Header = () => {
	const [isVisible, setIsVisible] = useState(true);
	const [activeMenu, setActiveMenu] = useState<string | null>(null);
	const [isSidebar, setSidebarOpen] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Scroll Logic
	useEffect(() => {
		const handleScroll = () => {
			// Header hides after scrolling 100px, then reappears if scrolling up or at top
			// You can adjust '100' to any threshold you prefer
			if (window.scrollY > 100) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Desktop Hover Handlers
	const handleEnter = (name: string) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setActiveMenu(name);
	};

	const headerVariants = {
		initial: {
			y: -100,
			opacity: 0,
		},
		animate: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				stiffness: 200,
				damping: 36,
			},
		},
		exit: {
			y: -100,
			opacity: 0,
			transition: {
				duration: 1.2,
				ease: "easeInOut",
			},
		},
	} as const;

	return (
		<>
			<AnimatePresence>
				{isVisible && !isSidebar && (
					<motion.header
						animate="animate"
						className="fixed inset-x-0 top-0 z-50 px-4 py-4 lg:px-8"
						exit="exit"
						initial="initial"
						key="main-header"
						onMouseLeave={() => setActiveMenu(null)}
						variants={headerVariants}
					>
						<nav className="relative mx-auto max-w-7xl">
							<div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-6 py-3 shadow-2xl backdrop-blur-xl">
								{/* Left: Logo & Mobile Toggle */}
								<div className="flex items-center justify-between gap-4">
									<button
										className="text-white/70 transition-colors hover:text-white md:hidden"
										onClick={() => setSidebarOpen(true)}
									>
										<Menu className="size-6" />
									</button>
									<div className="group hidden cursor-pointer items-center gap-2 md:flex">
										<Logo className="h-7 w-auto transition-transform group-hover:scale-110" />
										<span className="font-bold text-lg text-white tracking-tight">
											Rovodesk
										</span>
									</div>
								</div>

								{/* Visible on Mobile Only */}
								<div className="group flex cursor-pointer items-center gap-2 md:hidden">
									<Logo className="h-7 w-auto transition-transform group-hover:scale-110" />
									<span className="font-bold text-lg text-white tracking-tight">
										Rovodesk
									</span>
								</div>

								{/* Center: Desktop Nav Items */}
								<div className="hidden items-center gap-1 md:flex">
									{["Product", "Pricing", "Developers", "Blog"].map((item) => (
										<button
											className={cn(
												"relative rounded-md px-4 py-2 font-medium text-sm transition-colors",
												activeMenu === item
													? "text-white"
													: "text-gray-400 hover:text-white"
											)}
											key={item}
											onMouseEnter={() => handleEnter(item)}
										>
											<span className="relative z-10 flex items-center gap-1">
												{item}
												{item === "Product" && (
													<ChevronDown
														className={cn(
															"size-3 transition-transform",
															activeMenu === item && "rotate-180"
														)}
													/>
												)}
											</span>
											{activeMenu === item && (
												<motion.div
													className="absolute inset-0 rounded-md bg-white/10"
													layoutId="nav-pill"
													transition={{
														type: "spring",
														bounce: 0.2,
														duration: 0.6,
													}}
												/>
											)}
										</button>
									))}
								</div>

								{/* Right: CTA Actions */}
								<div className="flex items-center gap-6">
									<button className="group hidden items-center gap-1 font-semibold text-sm text-white/80 transition-colors hover:text-white lg:flex">
										Watch Demo
										<span className="flex size-5 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1 group-hover:bg-white/20">
											<Play className="size-2 fill-current" />
										</span>
									</button>
									<button className="rounded-lg bg-white px-5 py-2 font-bold text-black text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-100 hover:scale-105 hover:bg-blue-600 hover:text-white active:scale-95">
										Start Free
									</button>
								</div>
							</div>

							{/* MegaMenu Dropdown */}
							<AnimatePresence>
								{activeMenu &&
									(activeMenu === "Product" || activeMenu === "Solutions") && (
										<motion.div
											animate={{ opacity: 1, y: 0, scale: 1 }}
											className="absolute inset-x-0 top-[calc(100%+12px)] mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B]/90 shadow-2xl backdrop-blur-3xl"
											exit={{ opacity: 0, y: 10, scale: 0.98 }}
											initial={{ opacity: 0, y: 10, scale: 0.98 }}
											onMouseEnter={() => handleEnter(activeMenu)}
										>
											<MegaMenuContent activeMenu={activeMenu} />
										</motion.div>
									)}
							</AnimatePresence>
						</nav>
					</motion.header>
				)}
			</AnimatePresence>
			<Sidebar isOpen={isSidebar} onClose={() => setSidebarOpen(false)} />
		</>
	);
};

// --- Subcomponents ---

const MegaMenuContent = ({ activeMenu }: { activeMenu: string }) => {
	const data = menuConfig[activeMenu as keyof typeof menuConfig];

	return (
		<div className="grid grid-cols-12 gap-0">
			{/* Left Content Area */}
			<div className="col-span-8 grid grid-cols-2 gap-8 p-8">
				{Object.entries(data).map(([title, items]) => (
					<div className="space-y-4" key={title}>
						<h4 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.15em]">
							{title}
						</h4>
						<div className="grid gap-2">
							{items.map((item) => (
								<a
									className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
									href={item.href}
									key={item.label}
								>
									<div className="mt-1 rounded-lg bg-white/5 p-2 text-white transition-colors group-hover:bg-blue-600 group-hover:text-white">
										{item.icon && <item.icon className="size-4" />}
									</div>
									<div>
										<div className="font-semibold text-sm text-white">
											{item.label}
										</div>
										<div className="line-clamp-1 text-gray-400 text-xs">
											{item.description}
										</div>
									</div>
								</a>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Right Sidebar Area */}
			<div className="col-span-4 flex flex-col gap-6 border-white/5 border-l bg-white/2 p-8">
				<div className="rounded-2xl border border-white/10 bg-linear-to-br from-blue-600/20 to-purple-600/20 p-4">
					<div className="mb-3 flex size-8 items-center justify-center rounded-full bg-blue-600">
						<Play className="size-3 fill-white text-white" />
					</div>
					<h5 className="font-bold text-sm text-white">Product Overview</h5>
					<p className="mt-1 mb-4 text-gray-400 text-xs">
						See how Rovodesk can transform your workflow in 2 minutes.
					</p>
					<button className="flex items-center gap-1 font-bold text-white text-xs transition-all hover:gap-2">
						Watch Video <ArrowRight className="size-3" />
					</button>
				</div>

				<div className="space-y-3">
					<h5 className="font-bold text-[10px] text-gray-500 uppercase tracking-widest">
						Support
					</h5>
					<a
						className="group flex items-center justify-between text-gray-300 text-sm hover:text-white"
						href="/"
					>
						Contact Sales{" "}
						<ArrowRight className="size-3 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
					</a>
				</div>
			</div>
		</div>
	);
};

const Sidebar = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						animate={{ opacity: 1 }}
						className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						onClick={onClose}
					/>
					<motion.div
						animate={{ x: 0 }}
						className="fixed top-0 bottom-0 left-0 z-70 flex w-full max-w-[320px] flex-col border-white/10 border-r bg-[#0A0A0B] p-6"
						exit={{ x: "-100%" }}
						initial={{ x: "-100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
					>
						<div className="mb-10 flex items-center justify-between">
							<Logo className="h-7 w-auto" />
							<span className="font-bold text-lg text-white tracking-tight">
								Rovodesk
							</span>
							<button
								className="rounded-full bg-white/5 p-2 text-white"
								onClick={onClose}
							>
								<X className="size-5" />
							</button>
						</div>

						<nav className="flex-1 space-y-2">
							<MobileAccordion
								items={[...coreFeatures, ...advancedFeatures]}
								title="Platform"
							/>
							<MobileAccordion items={resources} title="Resources" />
							<a
								className="block border-white/5 border-b py-3 font-medium text-lg text-white"
								href="/"
							>
								Pricing
							</a>
							<a
								className="block border-white/5 border-b py-3 font-medium text-lg text-white"
								href="/"
							>
								Blog
							</a>
						</nav>

						<div className="grid gap-6 pt-6">
							<button className="w-full rounded-lg border border-white/10 bg-blue-600 py-3 font-semibold text-white hover:bg-blue-800">
								Watch Demo
							</button>
							<button className="w-full rounded-lg bg-white py-3 font-bold text-black transition-all hover:scale-102 hover:border-blue-600 hover:bg-gray-600/40 hover:text-white">
								Start Free
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

const MobileAccordion = ({
	title,
	items,
}: {
	title: string;
	items: MenuItem[];
}) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="border-white/5 border-b">
			<button
				className="flex w-full items-center justify-between py-4 font-medium text-lg text-white"
				onClick={() => setIsOpen(!isOpen)}
			>
				{title}
				<ChevronDown
					className={cn("size-4 transition-transform", isOpen && "rotate-180")}
				/>
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						animate={{ height: "auto", opacity: 1 }}
						className="overflow-hidden"
						exit={{ height: 0, opacity: 0 }}
						initial={{ height: 0, opacity: 0 }}
					>
						<div className="grid gap-4 pb-4 pl-4">
							{items.map((item) => (
								<a
									className="text-gray-400 text-sm hover:text-white"
									href={item.href}
									key={item.label}
								>
									{item.label}
								</a>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Header;
