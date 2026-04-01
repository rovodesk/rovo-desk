const vitestBase = {
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
} as const;

export default vitestBase;
