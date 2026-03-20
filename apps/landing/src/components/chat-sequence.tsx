import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { TypewriterText } from "@/components/typewritter-effect";

export const ChatSequence = ({ className }: { className?: string }) => {
	const [step, setStep] = useState(0);

	// Sequence logic to trigger messages one by one
	useEffect(() => {
		const interval = setInterval(() => {
			setStep((prev) => {
				if (prev >= 7) {
					clearInterval(interval);
					return prev;
				}
				return prev + 1;
			});
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={cn("flex flex-col gap-4 p-2", className)}>
			<AnimatePresence mode="popLayout">
				{step >= 1 && (
					<ChatMessage delay={0.05} key="msg1" type="user">
						Hi, I need some help. I lost my credit-card. Can you some how help
						🙏🏻
					</ChatMessage>
				)}
				{step >= 2 && (
					<ChatMessage delay={0.05} key="msg2" type="agent">
						Hi Alex, I'm sorry to hear that. I can deactivate the old card and
						order you a new one. For security, I'll need to send you an email to
						confirm your identity.
					</ChatMessage>
				)}
				{step >= 3 && (
					<ChatMessage delay={0.05} key="msg3" type="user">
						Sure, no problem
					</ChatMessage>
				)}
				{step >= 4 && (
					<div className="mt-4">
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="rounded-xl bg-white p-5 shadow-lg"
							initial={{ opacity: 0, y: 20 }}
						>
							<div className="mb-2 flex items-center gap-2 font-bold text-black">
								<span className="text-blue-600 text-xl">❊</span>
								<span className="text-sm">RovoDesk AI</span>
							</div>
							<TypewriterText
								className="text-gray-800"
								text="Thanks for confirming your identity. I can now authorise a new card for you."
							/>
						</motion.div>
					</div>
				)}
				{step >= 5 && (
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="mt-6 rounded-xl p-4 font-mono text-gray-400 text-sm"
						initial={{ opacity: 0, y: 20 }}
					>
						<div className="text-white">[ Action: {"Create_new_card"} ]</div>
						<div className="mt-2 ml-4">
							⚠️ <TypewriterText delay={8} text="Deactivating 'card';" />
						</div>
						<div className="ml-4">
							💳 <TypewriterText delay={12} text="Create 'new_card';" />
						</div>
						<div className="ml-4">
							🚀 <TypewriterText delay={16} text="Scheduling 'delivery';" />
						</div>
					</motion.div>
				)}
				{step >= 6 && (
					<ChatMessage delay={0.05} key="msg4" type="agent">
						Please Check, I think your problem is now Solved
					</ChatMessage>
				)}
				{step >= 7 && (
					<ChatMessage delay={0.05} key="msg5" type="user">
						Yes, Thanks 🤩
					</ChatMessage>
				)}
			</AnimatePresence>
		</div>
	);
};

export const ChatMessage = ({
	children,
	type,
	delay,
}: {
	children: string;
	type: "agent" | "user";
	delay: number;
}) => (
	<motion.div
		animate={{ opacity: 1, y: 0 }}
		className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
			type === "agent"
				? "self-start bg-white/10 text-white backdrop-blur-md"
				: "self-end bg-blue-600/70 text-white backdrop-blur-md"
		}`}
		exit={{ opacity: 0, y: -30 }}
		initial={{ opacity: 0, y: 30 }}
		layout
		transition={{ type: "spring", stiffness: 120, damping: 20 }}
	>
		<TypewriterText delay={delay} text={children} />
	</motion.div>
);
