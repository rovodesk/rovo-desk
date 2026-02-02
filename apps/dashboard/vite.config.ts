import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
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
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
		}),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		react(),
	],
	server: {
		port: 3001,
	},
<<<<<<< HEAD
=======
	optimizeDeps: {
		exclude: [
			"@zero-heads-lab/database",
			"@zero-heads-lab/cache",
			"@zero-heads-lab/email",
		],
	},
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
});

export default config;
