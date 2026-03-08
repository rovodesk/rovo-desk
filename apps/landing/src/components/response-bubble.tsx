export function ResponseBubble() {
	return (
		// <motion.div
		//     animate={{ opacity: 1, y: 0, scale: 1 }}
		//     className="absolute top-1/2 right-12 z-20 -translate-y-1/2"
		//     initial={{ opacity: 0, y: 20, scale: 0.9 }}
		//     transition={{
		//         delay: 2,
		//         duration: 1,
		//         repeat: Number.POSITIVE_INFINITY,
		//         repeatDelay: 5,
		//     }}
		// >
		<div className="relative rounded-2xl bg-indigo-600 font-semibold text-white text-xs shadow-2xl">
			"Your refund has been processed."
		</div>
		// </motion.div>
	);
}
