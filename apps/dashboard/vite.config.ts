import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react-swc";
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
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		viteReact(),
	],
	server: {
		host: true,
		port: 3001,
		strictPort: true,
		allowedHosts: ["dashboard.zeroheads.local"],
	},
});

export default config;
