import { createStart } from "@tanstack/react-start";
import { loggingMiddleware } from "@/middlewares/logging.middleware";

export const startInstance = createStart(() => {
	return {
		requestMiddleware: [loggingMiddleware],
	};
});
