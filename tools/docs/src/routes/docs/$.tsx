import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Suspense } from "react";
import { LLMCopyButton, ViewOptions } from "@/components/ai/page-actions";
import { baseOptions, gitConfig } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export const Route = createFileRoute("/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await loader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
});

const loader = createServerFn({
	method: "GET",
})
	.inputValidator((slugs: string[]) => slugs)
	.middleware([staticFunctionMiddleware])
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) throw notFound();

		return {
			slugs: page.slugs,
			path: page.path,
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component(
		{ toc, frontmatter, default: MDX },
		// you can define props for the component
		{
			markdownUrl,
			path,
		}: {
			markdownUrl: string;
			path: string;
		}
	) {
		return (
			<DocsPage toc={toc}>
				<DocsTitle>{frontmatter.title}</DocsTitle>
				<DocsDescription>{frontmatter.description}</DocsDescription>
				<div className="-mt-4 flex flex-row items-center gap-2 border-b pb-6">
					<LLMCopyButton markdownUrl={markdownUrl} />
					<ViewOptions
						githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
						markdownUrl={markdownUrl}
					/>
				</div>
				<DocsBody>
					<MDX
						components={{
							...defaultMdxComponents,
						}}
					/>
				</DocsBody>
			</DocsPage>
		);
	},
});

function Page() {
	const { pageTree, slugs, path } = useFumadocsLoader(Route.useLoaderData());
	const markdownUrl = `/llms.mdx/docs/${[...slugs, "index.mdx"].join("/")}`;

	return (
		<DocsLayout {...baseOptions()} tree={pageTree}>
			<Link hidden to={markdownUrl} />
			<Suspense>
				{clientLoader.useContent(path, { markdownUrl, path })}
			</Suspense>
		</DocsLayout>
	);
}
