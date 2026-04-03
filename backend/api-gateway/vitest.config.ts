import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import vitestBase from "@zero-heads-lab/testing";
import { defineConfig, mergeConfig } from "vitest/config";

export default defineConfig(
	mergeConfig(vitestBase, {
		plugins: [
			cloudflareTest({
				wrangler: {
					environment: "staging",
					configPath: "./wrangler.jsonc",
				},
			}),
		],
		ssr: {
			noExternal: ["react", "react-dom", "@react-essential/"],
		},
		test: {
			name: "webhook-service",
			coverage: {
				enabled: true,
			},
			poolOptions: {
				workers: {
					wrangler: {
						configPath: "./wrangler.jsonc",
						environment: "staging",
					},
				},
			},
		},
	})
);
