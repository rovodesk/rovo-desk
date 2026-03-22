import { createRoot, type Root } from "react-dom/client";

export function ErrorMessage({ message }: { message: string }) {
	return (
		<div className="rounded-2xl bg-white p-4">
			<h1>Ooops. Something is missing.</h1>

			<div className="w-64">
				<p>{message}</p>
			</div>

			<a
				className="mx-auto my-6 block border border-blue-500 px-2 py-1 text-center font-semibold text-blue-500 text-sm no-underline"
				href="https://github.com/zero-heads-lab/zero-heads"
				rel="noopener noreferrer"
				target="_blank"
			>
				View the docs
			</a>
		</div>
	);
}

let root: Root | null = null;

export function renderError(rootEl: HTMLElement, message: string) {
	if (!root) {
		root = createRoot(rootEl);
	}

	root.render(<ErrorMessage message={message} />);
}
