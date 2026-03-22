import type { WidgetState } from "@zero-heads-lab/engine";
import { ChevronRight, Sparkles } from "lucide-react";
import { AvatarGroup } from "@/components/avatar";
import { CloseIcon } from "@/components/icons";
import Logo from "@/components/logo";
import { useWidgetActions } from "@/hooks/use-widget-actions";

export function WelcomeScreen({ state }: { state: WidgetState }) {
	const actions = useWidgetActions();

	return (
		<div className="relative flex h-full flex-col justify-between overflow-hidden text-white">
			{/* Background */}
			<div className="absolute inset-x-0 top-0 h-full bg-linear-to-b from-[#63554A]/50 via-[#0D0D0D]/80 to-[#0D0D0D]" />

			{/* Content */}
			<div className="relative z-10 flex flex-1 flex-col p-6 pt-10">
				{/* Top Bar */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-md">
							<Logo />
						</div>
					</div>

					<div className="flex items-center gap-6">
						{/* Avatar stack */}
						<AvatarGroup />
						<button
							className="text-white/60 hover:text-white"
							onClick={() => actions.close()}
						>
							<CloseIcon />
						</button>
					</div>
				</div>

				{/* Heading */}
				<div className="mt-10">
					<h1 className="font-bold text-[32px] text-white leading-[1.2] tracking-tight">
						Hello there.
						<br />
						How can we help?
					</h1>
				</div>

				{/* Primary CTA */}
				<div className="mt-6">
					<button
						className="group flex w-full items-center justify-between rounded-[14px] border border-white/10 bg-[#161616] p-[18px] shadow-sm transition hover:bg-[#202020]"
						onClick={() => actions.navigate("conversation")}
					>
						<div className="text-left">
							<div className="font-semibold text-[15px] text-white">
								Ask a question
							</div>
							<div className="mt-0.5 text-[13px] text-white/60">
								AI Agent and team can help
							</div>
						</div>

						<div className="flex items-center gap-3 text-white">
							<Sparkles className="h-[22px] w-[22px]" />
							<ChevronRight
								className="h-4 w-4 text-white/50"
								strokeWidth={2.5}
							/>
						</div>
					</button>
				</div>

				{/* Content Card */}
				<div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-white/10 bg-transparent">
					<div className="relative flex h-[190px] w-full flex-col items-center justify-center bg-[url('https://images.pexels.com/photos/35909414/pexels-photo-35909414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-center bg-cover">
						<div className="absolute inset-0 bg-black/50" />
						<div className="relative z-10 flex flex-col items-center gap-[6px] text-center font-bold text-white tracking-[0.08em]">
							<span className="text-[15px] leading-tight">PIONEER</span>
							<span className="text-[15px] leading-tight">SAVE THE DATE</span>
							<div className="h-2" />
							<span className="text-[13px] leading-tight">
								OCTOBER 8TH, 2026
							</span>
							<span className="text-[13px] leading-tight">
								SAN FRANCISCO, USA
							</span>
							<div className="h-2" />
							<span className="text-[13px] leading-tight">
								IN-PERSON + VIRTUAL
							</span>
						</div>
						<div className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-md bg-black/40 backdrop-blur-md">
							<Logo />
						</div>
					</div>

					<div className="flex-1 bg-[#161616] p-[18px]">
						<p className="font-semibold text-[15px] text-white leading-snug">
							Pioneer, the summit for AI Customer Service leaders, is coming to
							San Francisco.
						</p>
						<p className="mt-[6px] text-[14px] text-white/50">
							This year we'll explore AI transformation in
						</p>
					</div>
				</div>
			</div>

			{/* Footer handled by Navigation */}
		</div>
	);
}
