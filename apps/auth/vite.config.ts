import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
<<<<<<< HEAD
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
		port: 3001,
	},
=======
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
    port: 3001,
  },
>>>>>>> a5d2a16 (feat: added sso auth with dummy idp and created shared auth application)
});

export default config;
