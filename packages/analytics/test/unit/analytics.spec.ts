import { createMockKVNamespace } from "@zero-heads-lab/cache/test/mocks/kv-namespace";
import { describe, expect, it } from "vitest";
import { Analytics } from "../../lib/analytics";
import { createMockPostHog } from "../mocks/posthog";

describe("Analytics", () => {
	it("captures an event", async () => {
		const posthog = createMockPostHog();
		const kv = createMockKVNamespace();

		const analytics = new Analytics({
			posthogApiKey: "ph-key",
			posthogHost: "https://app.posthog.com",
			flagCache: kv,
			posthogClient: posthog as any,
		});

		await analytics.captureEvent("user-1", "user_signed_in", {
			method: "magic-link",
		});

		expect(posthog.captureSpy).toHaveBeenCalledWith({
			distinctId: "user-1",
			event: "user_signed_in",
			properties: {
				method: "magic-link",
			},
		});
	});

	it("captures an Error exception", () => {
		const posthog = createMockPostHog();
		const kv = createMockKVNamespace();

		const analytics = new Analytics({
			posthogApiKey: "ph-key",
			posthogHost: "https://app.posthog.com",
			flagCache: kv,
			posthogClient: posthog as any,
		});

		const error = new Error("boom");
		analytics.captureException(error, "user-1", { route: "/auth" });

		expect(posthog.captureExceptionSpy).toHaveBeenCalledWith(error, "user-1", {
			properties: { route: "/auth" },
		});
	});

	it("captures non-Error exceptions as events", () => {
		const posthog = createMockPostHog();
		const kv = createMockKVNamespace();

		const analytics = new Analytics({
			posthogApiKey: "ph-key",
			posthogHost: "https://app.posthog.com",
			flagCache: kv,
			posthogClient: posthog as any,
		});

		analytics.captureException("something bad", "user-1", { route: "/auth" });

		expect(posthog.captureSpy).toHaveBeenCalledWith({
			distinctId: "user-1",
			event: "error",
			properties: {
				message: "something bad",
				route: "/auth",
			},
		});
	});

	it("aliases and identifies a user", () => {
		const posthog = createMockPostHog();
		const kv = createMockKVNamespace();

		const analytics = new Analytics({
			posthogApiKey: "ph-key",
			posthogHost: "https://app.posthog.com",
			flagCache: kv,
			posthogClient: posthog as any,
		});

		analytics.identify("user-1", "anon-1", { email: "test@example.com" });

		expect(posthog.aliasSpy).toHaveBeenCalledWith({
			distinctId: "user-1",
			alias: "anon-1",
		});

		expect(posthog.identifySpy).toHaveBeenCalledWith({
			distinctId: "user-1",
			properties: {
				email: "test@example.com",
				$anon_id: "anon-1",
			},
		});
	});

	it("shuts down posthog", async () => {
		const posthog = createMockPostHog();
		const kv = createMockKVNamespace();

		const analytics = new Analytics({
			posthogApiKey: "ph-key",
			posthogHost: "https://app.posthog.com",
			flagCache: kv,
			posthogClient: posthog as any,
		});

		await analytics.shutdown(5000);

		expect(posthog.shutdownSpy).toHaveBeenCalledWith(5000);
	});
});
