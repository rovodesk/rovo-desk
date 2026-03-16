import BentoGrid from "./bento-grid";

export default function FeaturesSection() {
	return (
		<section className="relative mt-24 overflow-hidden px-6">
			{/* Header Container */}
			<div className="mb-16 flex flex-col items-center text-center md:mb-20">
				<h2 className="text-balance font-bold text-4xl text-neutral-900 tracking-tight sm:text-5xl dark:text-neutral-100">
					Everything you need to{" "}
					<span className="text-blue-600 dark:text-blue-600">scale faster</span>
				</h2>

				<p className="mt-4 max-w-2xl text-lg text-neutral-600 leading-8 dark:text-neutral-400">
					Explore the features that make RovoDesk the perfect choice for your
					business. Seamlessly integrated, incredibly fast.
				</p>
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Bento Grid */}
				<BentoGrid />
			</div>
		</section>
	);
}
