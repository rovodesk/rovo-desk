import type { Logger as PinoLogger } from "pino";
import { vi } from "vitest";

export type MockPinoLogger = {
	logger: PinoLogger;
	childSpy: ReturnType<typeof vi.fn>;
	errorSpy: ReturnType<typeof vi.fn>;
	warnSpy: ReturnType<typeof vi.fn>;
	infoSpy: ReturnType<typeof vi.fn>;
	debugSpy: ReturnType<typeof vi.fn>;
	traceSpy: ReturnType<typeof vi.fn>;
	children: MockPinoLogger[];
};

function makeMockPinoLogger(): MockPinoLogger {
	const errorSpy = vi.fn();
	const warnSpy = vi.fn();
	const infoSpy = vi.fn();
	const debugSpy = vi.fn();
	const traceSpy = vi.fn();
	const children: MockPinoLogger[] = [];

	const logger = {} as Partial<PinoLogger>;

	const childSpy = vi.fn((_ctx: Record<string, unknown>) => {
		const child = makeMockPinoLogger();
		children.push(child);
		return child.logger;
	});

	Object.assign(logger, {
		error: errorSpy,
		warn: warnSpy,
		info: infoSpy,
		debug: debugSpy,
		trace: traceSpy,
		child: childSpy,
	});

	return {
		logger: logger as PinoLogger,
		errorSpy,
		warnSpy,
		infoSpy,
		debugSpy,
		traceSpy,
		childSpy,
		children,
	};
}

export function createMockPino(): MockPinoLogger {
	return makeMockPinoLogger();
}
