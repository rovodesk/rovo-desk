"use client";

import { Input } from "@zero-heads-lab/design-system/components/ui/input";
import { motion } from "motion/react";
import { useState } from "react";

export default function ComingSoonSection() {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("email:", email);
	};

	return (
		<section className="relative my-22 overflow-hidden py-32">
			{/* Background Grid */}
			{/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb1a_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb1a_1px,transparent_1px)] bg-size-[40px_40px]" /> */}

			{/* Skewed Background Layers */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div className="relative h-105 w-[140%]">
					<div className="absolute inset-0 -skew-y-3 rounded-3xl bg-blue-600" />

					{/* <div className="absolute inset-0 -skew-y-2 rounded-3xl bg-blue-500 opacity-60 blur-2xl" /> */}

					<div className="absolute inset-0 -skew-y-3 rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600" />
				</div>
			</div>

			{/* Glow */}
			{/* <div className="pointer-events-none absolute inset-0 flex justify-center">
                <div className="h-100 w-200 bg-blue-500 opacity-30 blur-[120px]" />
            </div> */}

			{/* Content */}
			<div className="relative mx-auto max-w-4xl px-6 text-center text-white">
				<motion.h2
					className="font-bold text-4xl tracking-tight md:text-5xl"
					initial={{ opacity: 0, y: 40 }}
					transition={{ duration: 0.6 }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					Something powerful is coming
				</motion.h2>

				<motion.p
					className="mt-6 text-blue-100 text-lg"
					initial={{ opacity: 0, y: 40 }}
					transition={{ delay: 0.1 }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					We're building the next generation AI workspace. Join the waitlist and
					be the first to experience it.
				</motion.p>

				{/* Newsletter Form */}
				<motion.form
					className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
					initial={{ opacity: 0, y: 40 }}
					onSubmit={handleSubmit}
					transition={{ delay: 0.2 }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					<Input
						className="h-10 font-mono text-white placeholder:text-white focus:ring-0! sm:w-80"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your work email"
						required
						type="email"
						value={email}
					/>

					<button
						className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
						type="submit"
					>
						Join waitlist
					</button>
				</motion.form>

				{/* Social Proof */}
				<motion.p
					className="mt-6 text-blue-200 text-sm"
					initial={{ opacity: 0 }}
					transition={{ delay: 0.3 }}
					whileInView={{ opacity: 1 }}
				>
					Early access for founders, operators, and teams.
				</motion.p>
			</div>
		</section>
	);
}
