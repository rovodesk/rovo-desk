import type { Context } from "hono";

export function handleRouteSuccess(c: Context, message: string, code: number) {
	return c.json(
		{
			success: true,
			message,
		},
		code as 200 | 201 | 202
	);
}
