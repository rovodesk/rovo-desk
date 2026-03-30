import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import viteBase from "@zero-heads-lab/testing";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	viteBase,
	defineConfig({
		plugins: [
			cloudflareTest({
				wrangler: {
					environment: "staging",
					configPath: "./wrangler.jsonc",
				},
			}),
		],
		ssr: {
			noExternal: ["react", "react-dom", "/@react-essential/"],
		},
		test: {
			name: "api",
			include: ["**/*.spec.ts", "**/*.test.ts"],
			coverage: {
				enabled: true,
			},
		},
	})
);
