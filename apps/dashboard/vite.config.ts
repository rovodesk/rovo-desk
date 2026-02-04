import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { AUTH_CONFIG } from "@zero-heads-lab/auth/config";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		devtools(),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
	server: {
		port: 3001,
		cors: {
			...AUTH_CONFIG.CORS,
			origin: "*",
		},
	},
	optimizeDeps: {
		exclude: [
			"@zero-heads-lab/database",
			"@zero-heads-lab/cache",
			"@zero-heads-lab/email",
		],
	},
});

export default config;
