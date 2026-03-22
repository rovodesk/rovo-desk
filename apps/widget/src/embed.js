// embed.js
(() => {
	const script =
		document.currentScript || document.querySelector("script[data-rovodesk]");

	if (!script) return;

	// const baseUrl = new URL(script.src).origin;
	// HARD Code API URL
	const baseUrl = "http://localhost:5173";
	const allowedOrigin = new URL(baseUrl).origin;

	// Prevent duplicate
	if (document.getElementById("rovo-desk-widget-iframe")) return;

	const config = {
		apiKey: script.getAttribute("data-api-key") || "",
		userId: script.getAttribute("data-user-id") || "",
	};

	const iframe = document.createElement("iframe");
	iframe.id = "rovo-desk-widget-iframe";
	Object.assign(iframe.style, {
		position: "fixed",
		bottom: "45px",
		right: "45px",
		width: "64px",
		height: "64px",
		border: "none",
		zIndex: "9999",
		background: "transparent",
		colorScheme: "none",
		transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
	});

	// Build URL with params
	const url = new URL(`${baseUrl}`);
	url.searchParams.set("apiKey", config.apiKey);
	url.searchParams.set("userId", config.userId);

	iframe.src = url.toString();

	document.body.appendChild(iframe);

	// Message handler
	const handleMessage = (event) => {
		if (event.origin !== baseUrl) return;

		const { type, width, height } = event.data || {};

		if (type === "rovodesk:resize") {
			if (width) iframe.style.width = `${width}px`;
			if (height) iframe.style.height = `${height}px`;
		}

		if (type === "rovodesk:open") {
			iframe.style.width = "380px";
			iframe.style.height = "600px";
		}

		if (type === "rovodesk:close") {
			iframe.style.width = "64px";
			iframe.style.height = "64px";
		}
	};

	window.addEventListener("message", handleMessage);

	// Public API (VERY IMPORTANT)
	window.Rovodesk = {
		open() {
			iframe.contentWindow?.postMessage(
				{ type: "rovodesk:open" },
				allowedOrigin
			);
		},
		close() {
			iframe.contentWindow?.postMessage(
				{ type: "rovodesk:close" },
				allowedOrigin
			);
		},
		destroy() {
			window.removeEventListener("message", handleMessage);
			iframe.remove();
			window.Rovodesk = undefined;
		},
	};
})();
