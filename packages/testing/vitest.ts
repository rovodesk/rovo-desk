import { defineConfig } from "vitest/config";

const vitestBase = defineConfig({
	test: {
		globals: true,
		clearMocks: true,
		restoreMocks: true,
		mockReset: true,
		passWithNoTests: true,
		coverage: {
			provider: "istanbul",
			reporter: ["text", "html", "lcov", "json-summary"],
			reportsDirectory: "../../coverage",
		},
		include: ["**/*.spec.ts", "**/*.test.ts"],
	},
});

export default vitestBase;
