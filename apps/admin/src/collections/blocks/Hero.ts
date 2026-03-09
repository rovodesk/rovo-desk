import type { Block } from "payload";

export const Hero: Block = {
	slug: "hero",
	fields: [
		{
			name: "badge",
			type: "text",
			label: "Badge",
		},
		{
			name: "headline",
			type: "group",
			label: "Headline",
			fields: [
				{
					name: "prefix",
					type: "text",
					label: "Prefix Text",
					admin: {
						description: "Optional text before the main headline",
					},
				},
				{
					name: "highlight",
					type: "text",
					label: "Highlighted Text",
					admin: {
						description:
							"Text to highlight in the headline (e.g. with a background color)",
					},
				},
				{
					name: "line2",
					type: "text",
					label: "Second Line",
					admin: {
						description: "Optional second line for the headline",
					},
				},
				{
					name: "accent",
					type: "text",
					label: "Accent Word",
					admin: {
						description:
							"Optional text to accent in the headline (e.g. with a different color)",
					},
				},
				{
					name: "suffix",
					type: "text",
					label: "Suffix Text",
					admin: {
						description: "Optional text after the main headline",
					},
				},
			],
			required: true,
		},
		{
			name: "subHeadline",
			type: "group",
			label: "Sub Headline",
			fields: [
				{
					name: "text",
					type: "text",
					label: "Sub Headline Text",
				},
				{
					name: "enabled",
					type: "checkbox",
					label: "Enable Sub Headline",
				},
			],
		},
		{
			name: "cta",
			type: "group",
			label: "Call to Action (CTA)",
			fields: [
				{
					name: "links",
					type: "array",
					label: "CTA Link",
					fields: [
						{
							name: "label",
							type: "text",
							label: "CTA Label",
							required: true,
						},
						{
							name: "link",
							type: "text",
							label: "CTA Link",
							required: true,
						},
					],
				},
			],
		},
		{
			name: "background",
			type: "group",
			label: "Background",
			fields: [
				{
					name: "image",
					type: "upload",
					relationTo: "media",
					label: "Background Image",
				},
				{
					name: "overlay",
					type: "checkbox",
					label: "Enable Overlay",
				},
			],
		},
	],
};
