<<<<<<< HEAD
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import {
	type DocsCollection,
	defineConfig,
	defineDocs,
} from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs: DocsCollection = defineDocs({
	dir: "content/docs",
	docs: {
		schema: pageSchema,
=======
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
	dir: "content/docs",
	docs: {
>>>>>>> b290694 (refactor: Moved docs from tools to apps)
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
<<<<<<< HEAD
	meta: {
		schema: metaSchema,
	},
});

export default defineConfig({
	mdxOptions: {
		// MDX options
	},
});
=======
});

export default defineConfig();
>>>>>>> b290694 (refactor: Moved docs from tools to apps)
