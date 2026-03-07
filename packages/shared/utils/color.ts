import z from "zod";

export const hexColor = z
	.string()
	.regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color");
