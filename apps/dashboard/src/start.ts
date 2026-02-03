import { createStart } from "@tanstack/react-start";
import { deviceIdMiddleware } from "@/middlewares/device-id.middleware";
import { loggingMiddleware } from "@/middlewares/logging.middleware";

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [deviceIdMiddleware, loggingMiddleware],
	};
});
