import type { SDKConfig } from "../config";

let initPromise: Promise<void> | null = null;

export function initSDK(config: SDKConfig) {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		console.log("RovoDesk init");

		const tokenRes = await fetch(`${config.apiBaseUrl}/auth`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				organizationId: config.organizationId,
				user: config.user,
				accessKey: config.accessKey,
			}),
		});

		const { token } = await tokenRes.json();

		const res = await fetch(`${config.apiBaseUrl}/init`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				workspaceId: config.organizationId,
				user: config.user,
			}),
		});

		const data = await res.json();

		console.log("Widget config", data);
	})();

	return initPromise;
}
