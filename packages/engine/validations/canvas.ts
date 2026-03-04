import { z } from "zod";

const hexColor = z
	.string()
	.regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color");

const themeSchema = z.object({
	colors: z
		.object({
			primary: hexColor.optional(),
			secondary: hexColor.optional(),
			accent: hexColor.optional(),
			background: hexColor.optional(),
			text: hexColor.optional(),
		})
		.partial()
		.optional(),

	fonts: z
		.object({
			body: z.string().optional(),
			header: z.string().optional(),
			subheader: z.string().optional(),
		})
		.partial()
		.optional(),

	shadow: z
		.object({
			blur: z.number().min(0).optional(),
			spread: z.number().min(0).optional(),
			opacity: z.number().min(0).max(1).optional(),
			color: hexColor.optional(),
		})
		.partial()
		.optional(),

	radius: z.enum(["sm", "md", "lg"]).default("md"),
});

const baseComponent = z.object({
	id: z.string().min(1),
});

const textComponent = baseComponent.extend({
	type: z.literal("text"),
	text: z.string(),
	align: z.enum(["left", "center", "right"]).optional().default("left"),
	style: z.enum(["body", "header", "subheader"]).optional().default("body"),
});

const textareaComponent = baseComponent.extend({
	type: z.literal("textarea"),
	label: z.string(),
	placeholder: z.string().optional(),
	required: z.boolean().optional().default(false),
});

const imageComponent = baseComponent.extend({
	type: z.literal("image"),
	url: z.url(),
	alt: z.string().optional(),
});

const optionSchema = z.object({
	id: z.string(),
	text: z.string(),
});

const singleSelectComponent = baseComponent.extend({
	type: z.literal("single-select"),
	label: z.string(),
	options: z.array(optionSchema).min(1),
	required: z.boolean().optional().default(false),
});

const multiSelectComponent = baseComponent.extend({
	type: z.literal("multi-select"),
	label: z.string(),
	options: z.array(optionSchema).min(1),
	required: z.boolean().optional().default(false),
});

const buttonComponent = baseComponent.extend({
	type: z.literal("button"),
	label: z.string(),
	style: z.enum(["primary", "secondary"]).optional().default("primary"),
	action: z.object({
		type: z.enum(["submit", "link"]).default("submit"),
		url: z.url().optional(),
	}),
});

export const componentSchema = z.discriminatedUnion("type", [
	textComponent,
	textareaComponent,
	imageComponent,
	singleSelectComponent,
	multiSelectComponent,
	buttonComponent,
]);

const viewSchema = z.object({
	id: z.string(), // for multi-step flows
	label: z.string(),
	icon: z.string().optional(),
	components: z.array(componentSchema).min(1),
});

export const canvasSchema = z
	.object({
		canvas: z.object({
			version: z.literal("1").default("1"), //
			views: z.array(viewSchema).min(1),
			theme: themeSchema.optional(),
			colorMode: z
				.enum(["light", "dark", "system"])
				.optional()
				.default("system"),
		}),
	})
	.strict();

export type Canvas = z.infer<typeof canvasSchema>["canvas"];
