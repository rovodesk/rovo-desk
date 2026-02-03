import { createMiddleware } from "@tanstack/react-start";
import { generateUUID } from "@zero-heads-lab/shared/utils";

export const deviceIdMiddleware = createMiddleware().server(
	({ next, request }) => {
		const cookieHeader = request.headers.get("cookie") ?? "";

		const cookies = Object.fromEntries(
			cookieHeader
				.split(";")
				.map((c) => c.trim().split("="))
				.filter(([k]) => k)
		);

		let deviceId = cookies.device_id;

		if (!deviceId) {
			deviceId = generateUUID();

			request.headers.append(
				"Set-Cookie",
				[
					`device_id=${deviceId}`,
					"Path=/",
					"HttpOnly",
					"SameSite=Lax",
					"Max-Age=31536000", // 1 year
					process.env.NODE_ENV === "production" ? "Secure" : "",
				]
					.filter(Boolean)
					.join("; ")
			);

			request.headers.set("device-id", deviceId);
		}

		// Attach to request context (this is what Better-Auth will read)
		return next({
			context: {
				deviceId,
			},
		});
	}
);
