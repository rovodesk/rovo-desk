import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["index.ts"],
	format: ["esm", "iife"],
	dts: true,
	clean: true,
	sourcemap: true,
	minify: false,
	splitting: false, // IMPORTANT → single file
	bundle: true,
});
