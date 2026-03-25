import type { PostHog } from "posthog-node";
import { vi } from "vitest";

export type MockPostHog = Pick<
	PostHog,
	"capture" | "captureException" | "alias" | "identify" | "shutdown"
> & {
	captureSpy: ReturnType<typeof vi.fn>;
	captureExceptionSpy: ReturnType<typeof vi.fn>;
	aliasSpy: ReturnType<typeof vi.fn>;
	identifySpy: ReturnType<typeof vi.fn>;
	shutdownSpy: ReturnType<typeof vi.fn>;
};

export function createMockPostHog(): MockPostHog {
	const captureSpy = vi.fn();
	const captureExceptionSpy = vi.fn();
	const aliasSpy = vi.fn();
	const identifySpy = vi.fn();
	const shutdownSpy = vi.fn().mockResolvedValue(undefined);

	return {
		capture: captureSpy,
		captureException: captureExceptionSpy,
		alias: aliasSpy,
		identify: identifySpy,
		shutdown: shutdownSpy,

		captureSpy,
		captureExceptionSpy,
		aliasSpy,
		identifySpy,
		shutdownSpy,
	};
}
