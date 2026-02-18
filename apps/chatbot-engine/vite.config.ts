import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts", // your library entry
			name: "vanillaJsChatbot", // becomes window.vanillaJsChatbot
			fileName: "index",
			formats: ["umd"], // UMD for <script>
		},
		outDir: "dist",
		emptyOutDir: true,
		watch: {
			include: ["src"],
			exclude: ["node_modules"],
			clearScreen: true,
			onInvalidate: (id) => {
				console.log(`File ${id} has changed. Rebuilding...`);
			},
		},
	},
});
