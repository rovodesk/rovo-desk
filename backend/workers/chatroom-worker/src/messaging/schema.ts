import { z } from "zod";

const messageTypeSchema = z.enum([
	"user",
	"ai",
	"agent",
	"system",
	"escalation",
]);
const fileTypeSchema = z.enum(["image", "video", "audio", "file"]);

export const attachmentSchema = z.object({
	url: z.url(),
	type: fileTypeSchema,
	name: z.string(),
	size: z.number(),
	duration: z.number().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
});

const chatMessageSchema = z.object({
	id: z.uuid(),
	timestamp: z.number(),
	content: z.string(),
	senderId: z.string().optional(),
	type: messageTypeSchema,
	attachment: attachmentSchema.optional(),
	sequence: z.number().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
