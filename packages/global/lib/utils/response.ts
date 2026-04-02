import type { Context, Env } from "hono";

export function handleRouteError<T extends Env>(
	c: Context<T>,
	error: unknown,
	code?: number
) {
	if (error instanceof Error) {
		return c.json(
			{
				success: false,
				error: error.message,
			},
			(code ?? 500) as 400 | 401 | 403 | 404 | 415 | 422 | 500
		);
	}
	return c.json(
		{
			success: false,
			error: "Internal Server Error",
		},
		500
	);
}

export function handleRouteSuccess(c: Context, message: string, code: number) {
	return c.json(
		{
			success: true,
			message,
		},
		code as 200 | 201 | 202
	);
}
