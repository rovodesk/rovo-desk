import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import vitestBase from "@zero-heads-lab/testing";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	vitestBase,
	defineConfig({
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		test: {
			name: "web",
			environment: "jsdom",
			setupFiles: ["./test/setup.ts"],
			include: ["src/**/*.{test,spec}.{ts,tsx}"],
		},
	})
);
