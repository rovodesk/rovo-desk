import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			input: {
				app: resolve(__dirname, "index.html"),
				loader: resolve(__dirname, "src/embed.ts"),
			},
			output: {
				entryFileNames: (chunkInfo) => {
					// We want the loader to be named widget.js for the user
					return chunkInfo.name === "loader" ? "widget.js" : "[name].js";
				},
				// For the loader, we might want it to be an IIFE.
				// But rollupOptions input + standard build usually makes it ESM.
				// For a generic iframe widget loader, we want IIFE.
			},
		},
	},
	server: {
		port: 3003,
		host: true,
	},
});
