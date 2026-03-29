import { createRoot, type Root } from "react-dom/client";

export function Loading() {
	return (
		<div className="fixed right-6 bottom-6 z-1000 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0B0C]/90 px-4 py-3 text-sm text-white/80 shadow-lg backdrop-blur-xl">
			<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
			<span>Loading widget...</span>
		</div>
	);
}

const roots = new WeakMap<HTMLElement, Root>();

export function renderLoading(rootEl: HTMLElement) {
	let root = roots.get(rootEl);

	if (!root) {
		root = createRoot(rootEl);
		roots.set(rootEl, root);
	}

	root.render(<Loading />);

	return root;
}
