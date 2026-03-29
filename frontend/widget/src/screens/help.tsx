import { ChevronRight, MessageCircle, Search } from "lucide-react";
import { useWidgetActions } from "@/hooks/use-widget-actions";

export function HelpScreen() {
	const categories = [
		{
			title: "Getting started",
			description: "Setup and basics",
		},
		{
			title: "Billing & plans",
			description: "Pricing, invoices, upgrades",
		},
		{
			title: "Integrations",
			description: "Connect your tools",
		},
		{
			title: "Troubleshooting",
			description: "Fix common issues",
		},
	];

	const actions = useWidgetActions();

	return (
		<div className="relative flex h-full flex-col overflow-hidden text-white">
			{/* Background */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
			<div className="absolute inset-0 bg-black" />

			<div className="relative z-10 flex h-full flex-col">
				{/* Header */}
				<div className="px-5 pt-5 pb-4">
					<h1 className="font-semibold text-lg">Help Center</h1>
					<p className="text-sm text-white/60">Find answers instantly</p>
				</div>

				{/* Search */}
				<div className="px-4 pb-4">
					<div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
						<Search className="h-4 w-4 text-white/40" />
						<input
							className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
							placeholder="Search for help..."
						/>
					</div>
				</div>

				{/* Categories */}
				<div className="flex-1 space-y-2 overflow-y-auto px-3 pb-24">
					{categories.map((item) => (
						<div
							className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/10"
							key={item.title}
						>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">{item.title}</p>
									<p className="text-sm text-white/60">{item.description}</p>
								</div>

								<ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white" />
							</div>
						</div>
					))}
				</div>

				{/* Contact CTA */}
				<div className="pointer-events-none absolute right-0 bottom-5 left-0 flex justify-center px-4">
					<button
						className="pointer-events-auto flex items-center gap-2 rounded-full px-5 py-5 font-medium text-sm shadow-lg"
						onClick={() => actions.switchTab("conversations")}
					>
						<MessageCircle className="h-4 w-4" />
						Ask a question
					</button>
				</div>
			</div>
		</div>
	);
}
