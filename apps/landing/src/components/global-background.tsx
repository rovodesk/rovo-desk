export function GlobalBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 z-10">
			<div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />

			{/* Subtle radial light (top) */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />

			{/* Blue ambient glow (matches your section) */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_70%)]" />

			{/* Bottom fade for depth */}
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black" />

			{/* Optional: noise texture (VERY premium) */}
			{/* <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" /> */}
		</div>
	);
}
