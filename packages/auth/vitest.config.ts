import vitestBase from "@zero-heads-lab/testing";
import { defineConfig, mergeConfig } from "vitest/config";

export default defineConfig(
	mergeConfig(vitestBase, {
		test: {
			name: "auth",
		},
	})
);
