import { ArrowLeft, ArrowUp, Paperclip, PhoneCall } from "lucide-react";
import { useState } from "react";
import { CloseIcon } from "@/components/icons";
import Logo from "@/components/logo";
import { useWidgetActions } from "@/hooks/use-widget-actions";

export function ConversationScreen() {
	const actions = useWidgetActions();

	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content: "Hi there 👋\n\nYou are now speaking with Rovo. How can I help?",
			time: "Just now",
		},
	]);

	const [input, setInput] = useState("");

	const sendMessage = () => {
		if (!input.trim()) return;

		setMessages((prev) => [
			...prev,
			{ role: "user", content: input, time: "Now" },
			{
				role: "assistant",
				content: "Got it — let me help you with that.",
				time: "Now",
			},
		]);

		setInput("");
	};

	return (
		<div className="relative flex h-full flex-col overflow-hidden bg-black text-white">
			<div className="relative z-10 flex h-full flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-white/10 border-b bg-[#161618] px-4 py-3">
					<div className="flex items-center gap-4">
						<button onClick={() => actions.navigate("inbox")}>
							<ArrowLeft className="h-4 w-4/ text-white/60 hover:text-white" />
						</button>
						<div className="flex items-center gap-2">
							<Logo size={8} />
							<div>
								<p className="font-medium text-sm">Rovo</p>
								<p className="text-white/50 text-xs">The team can also help</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<button
							className="text-white/60 hover:text-white"
							disabled={true}
							onClick={() => actions.navigate("help")}
						>
							<PhoneCall className="h-4 w-4 data-disabled:text-white/20" />
						</button>
						<button
							className="text-white/60 hover:text-white"
							onClick={() => actions.close()}
						>
							<CloseIcon />
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
					{messages.map((msg, i) => {
						const isUser = msg.role === "user";

						return (
							<div
								className={`flex ${isUser ? "justify-end" : "justify-start"}`}
								key={i}
							>
								<div className="max-w-[80%]">
									{/* Bubble */}
									<div
										className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
											isUser
												? "bg-indigo-600 text-white"
												: "bg-white/10 text-white/90 backdrop-blur"
										}`}
									>
										{msg.content}
									</div>

									{/* Meta */}
									{!isUser && (
										<p className="mt-2 text-white/40 text-xs">
											Fin • AI Agent • {msg.time}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Floating Input */}
				<div className="pointer-events-none absolute right-0 bottom-4 left-0 px-4">
					<div className="pointer-events-auto rounded-2xl border border-white/20 bg-white/5 p-2 shadow-xl backdrop-blur-xl">
						<div className="flex items-center gap-2">
							<button
								className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:text-white"
								onClick={sendMessage}
							>
								<Paperclip className="h-4 w-4" />
							</button>
							<input
								className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/40"
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && sendMessage()}
								placeholder="Ask a question..."
								value={input}
							/>

							<button
								className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
								onClick={sendMessage}
							>
								<ArrowUp className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Footer */}
					<p className="mt-2 text-center text-[11px] text-white/30">
						By chatting with us, you agree to our Privacy Policy
					</p>
				</div>
			</div>
		</div>
	);
}
