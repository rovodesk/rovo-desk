import vitestBase from "@zero-heads-lab/testing";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	vitestBase,
	defineConfig({
		test: {
			name: "analytics",
			include: ["test/**/*.test.ts", "test/**/*.spec.ts"],
		},
	})
);
