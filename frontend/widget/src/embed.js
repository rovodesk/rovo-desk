/** biome-ignore-all lint/suspicious/noVar: for embed */
/** biome-ignore-all lint/complexity/useArrowFunction: for embed */
/** biome-ignore-all  lint/complexity/noArguments: for embed */

(function () {
	var w = window,
		d = document;

	var rd = w.Rovodesk;
	if (typeof rd === "function") {
		rd("update", w.RovodeskSettings);
		return;
	}

	rd = function () {
		rd.q.push(arguments);
	};
	rd.q = [];
	w.Rovodesk = rd;

	function load() {
		var settings = w.RovodeskSettings || {};
		var base = "http://localhost:3006";

		var iframe = d.createElement("iframe");
		iframe.src = base;
		iframe.id = "rovodesk-widget";
		Object.assign(iframe.style, {
			position: "fixed",
			bottom: "0px",
			right: "0px",
			border: "none",
			background: "transparent",
			zIndex: "9999",
			overflow: "hidden",
		});

		d.body.appendChild(iframe);

		var widgetOrigin;

		// ✅ Send INIT after load
		iframe.onload = function () {
			widgetOrigin = new URL(iframe.src).origin;

			iframe.contentWindow.postMessage(
				{ type: "init", payload: settings },
				widgetOrigin
			);
		};

		// ✅ Handle resize
		function onMsg(e) {
			if (widgetOrigin && e.origin !== widgetOrigin) return;

			var data = e.data || {};

			if (data.type === "resize") {
				if (data.width) iframe.style.width = `${data.width}px`;
				if (data.height) iframe.style.height = `${data.height}px`;
			}
		}

		w.addEventListener("message", onMsg);

		// ✅ Public API
		w.Rovodesk = function (cmd, payload) {
			if (!(iframe.contentWindow && widgetOrigin)) return;

			iframe.contentWindow.postMessage({ type: cmd, payload }, widgetOrigin);
		};

		// Flush queued calls
		rd.q.forEach(function (args) {
			w.Rovodesk.apply(null, args);
		});
	}

	if (d.readyState === "complete") load();
	else w.addEventListener("load", load);
})();
