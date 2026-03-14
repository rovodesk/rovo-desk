import type { Collection, ContentEntry, EffectPreset } from "../types";

export const defaultCollections: Record<string, Collection> = {
	col_blog: {
		id: "col_blog",
		name: "Blog Posts",
		slug: "blog-posts",
		icon: "FileText",

		timestamps: true,
		drafts: true,
		versions: true,

		fields: [
			{
				id: "f1",
				name: "title",
				label: "Title",
				type: "text",
				config: {
					required: true,
					placeholder: "Enter post title...",
					animation: {
						effect: "reveal",
						delay: 0,
						threshold: 0.5,
					},
				},
			},

			{
				id: "f2",
				name: "content",
				label: "Content",
				type: "richtext",
				config: {
					required: true,
					placeholder: "Write your story...",
					animation: {
						effect: "fade",
						delay: 0.1,
						threshold: 0.5,
					},
				},
			},

			{
				id: "f3",
				name: "coverImage",
				label: "Cover Image",
				type: "media",
				config: {
					animation: {
						effect: "scale",
						delay: 0.2,
						threshold: 0.5,
					},
				},
			},

			{
				id: "f4",
				name: "publishDate",
				label: "Publish Date",
				type: "date",
				config: {
					animation: {
						effect: "fade",
						delay: 0.3,
						threshold: 0.5,
					},
				},
			},

			{
				id: "f5",
				name: "category",
				label: "Category",
				type: "select",
				config: {
					required: true,
					options: ["Technology", "Design", "Business", "Culture"],
				},
			},
		],

		createdAt: new Date("2026-03-01"),
		updatedAt: new Date("2026-03-12"),
	},

	col_pages: {
		id: "col_pages",
		name: "Pages",
		slug: "pages",
		icon: "Layout",

		timestamps: true,
		drafts: true,
		versions: true,

		fields: [
			{
				id: "f6",
				name: "title",
				label: "Page Title",
				type: "text",
				config: {
					required: true,
					placeholder: "Page title...",
					animation: {
						effect: "slide-up",
						delay: 0,
						threshold: 0.5,
					},
				},
			},

			{
				id: "f7",
				name: "slug",
				label: "Slug",
				type: "text",
				config: {
					required: true,
					unique: true,
					indexed: true,
					placeholder: "/about",
				},
			},

			{
				id: "f8",
				name: "meta",
				label: "Meta Data",
				type: "json",
			},

			{
				id: "f9",
				name: "blocks",
				label: "Page Builder",
				type: "blocks",
			},
		],

		createdAt: new Date("2026-03-02"),
		updatedAt: new Date("2026-03-05"),
	},
};

export const defaultEntries: Record<string, ContentEntry> = {
	entry_blog_1: {
		id: "entry_blog_1",
		collectionId: "col_blog",
		slug: "building-modern-cms",

		data: {
			title: "Building Modern CMS Systems",
			content: "A deep dive into...",
			category: "Technology",
		},

		status: "published",

		system: {
			createdAt: new Date("2026-03-10"),
			updatedAt: new Date("2026-03-12"),
			publishedAt: new Date("2026-03-12"),
		},
	},
};

export const defaultActiveCollectionId = "col_blog";

export const animationPresets: { value: EffectPreset; label: string }[] = [
	{ value: "none", label: "None" },
	{ value: "fade", label: "Fade" },
	{ value: "slide-up", label: "Slide Up" },
	{ value: "slide-left", label: "Slide Left" },
	{ value: "scale", label: "Scale" },
	{ value: "reveal", label: "Reveal" },
];
