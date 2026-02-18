import { docs } from "fumadocs-mdx:collections/server";
import { type InferPageType, loader, update } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

/**
 * Base raw source (unfiltered)
 */
const baseSource = docs.toFumadocsSource();

/**
 * Helper to extract processed LLM-ready text
 */
export async function getLLMText(page: InferPageType<typeof source>) {
	const processed = await page.data.getText("processed");
	return `# ${page.data.title}\n\n${processed}`;
}

/**
 * Factory for permission-based sources
 */
export function createSource(permission: "public" | "internal") {
	const filtered = update(baseSource)
		.files((files) =>
			files.filter((file) => {
				if (file.type === "meta") return true;
				return file.data.permission === permission;
			})
		)
		.build();

	return loader({
		source: filtered,
		baseUrl: "/docs",
		plugins: [lucideIconsPlugin()],
	});
}

/**
 * Default source (all docs)
 */
export const source = loader({
	source: baseSource,
	baseUrl: "/docs",
	plugins: [lucideIconsPlugin()],
});
