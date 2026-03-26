import vitestBase from "@zero-heads-lab/testing";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	vitestBase,
	defineConfig({
		test: {
			name: "database",
			globals: true,
			setupFiles: [
				"./test/integration/setup/global-setup.ts",
				"./test/integration/setup/cleanup.ts",
			],
			include: ["test/**/*.test.ts", "test/**/*.spec.ts"],
		},
	})
);
