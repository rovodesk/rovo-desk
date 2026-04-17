import z from "zod";

// Generic JSON type (safe for Encore + sync)
export const jsonSchema: z.ZodType<unknown> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(jsonSchema),
		z.record(z.string(), jsonSchema),
	])
);

export const documentStatusSchema = z.enum(["draft", "published", "archived"]);

export const documentSchema = z.object({
	id: z.string(),
	workspaceId: z.string(),

	title: z.string(),
	slug: z.string(),

	status: documentStatusSchema,
	currentVersionId: z.string().nullable(),

	createdBy: z.string(),

	createdAt: z.number(),
	updatedAt: z.number(),
});

export type Document = z.infer<typeof documentSchema>;

export const blockTypeSchema = z.enum([
	"paragraph",
	"heading",
	"code",
	"list",
	"quote",
	"image",
	"table",
]);

export const blockSchema = z.object({
	id: z.string(),
	documentId: z.string(),

	type: blockTypeSchema,

	parentId: z.string().nullable(),
	order: z.number(),

	content: jsonSchema, // flexible but validated
	props: jsonSchema.optional(),

	createdAt: z.number(),
	updatedAt: z.number(),
	deletedAt: z.number().nullable(),
});

export type Block = z.infer<typeof blockSchema>;
/**
 * {
  "id": "b1",
  "documentId": "doc1",
  "type": "paragraph",
  "parentId": null,
  "order": 1,
  "content": {
    "text": "Hello world"
  }
    👉 Use parentId + order instead of arrayss
}
 */ export const documentVersionSchema = z.object({
	id: z.string(),
	documentId: z.string(),

	versionNumber: z.number(),

	snapshot: jsonSchema.optional(),

	createdBy: z.string(),
	createdAt: z.number(),
});

export type DocumentVersion = z.infer<typeof documentVersionSchema>;

export const draftSchema = z.object({
	id: z.string(),
	documentId: z.string(),

	versionBase: z.number(),

	updatedAt: z.number(),
});

export type Draft = z.infer<typeof draftSchema>;

export const operationTypeSchema = z.enum([
	"insert_block",
	"update_block",
	"delete_block",
	"move_block",
]);

const insertBlockPayload = z.object({
	block: blockSchema,
});

const updateBlockPayload = z.object({
	updates: jsonSchema, // e.g. { "content.text": "new" }
});

const deleteBlockPayload = z.object({
	blockId: z.string(),
});

const moveBlockPayload = z.object({
	blockId: z.string(),
	parentId: z.string().nullable(),
	order: z.number(),
});

export const operationSchema = z.discriminatedUnion("type", [
	z.object({
		id: z.string(),
		documentId: z.string(),
		blockId: z.string().nullable(),

		type: z.literal("insert_block"),
		payload: insertBlockPayload,

		actorId: z.string(),
		timestamp: z.number(),
	}),

	z.object({
		id: z.string(),
		documentId: z.string(),
		blockId: z.string(),

		type: z.literal("update_block"),
		payload: updateBlockPayload,

		actorId: z.string(),
		timestamp: z.number(),
	}),

	z.object({
		id: z.string(),
		documentId: z.string(),
		blockId: z.string(),

		type: z.literal("delete_block"),
		payload: deleteBlockPayload,

		actorId: z.string(),
		timestamp: z.number(),
	}),

	z.object({
		id: z.string(),
		documentId: z.string(),
		blockId: z.string(),

		type: z.literal("move_block"),
		payload: moveBlockPayload,

		actorId: z.string(),
		timestamp: z.number(),
	}),
]);

export type Operation = z.infer<typeof operationSchema>;
