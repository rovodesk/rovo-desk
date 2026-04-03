import { HTTPException } from "hono/http-exception";
import { ServerError } from "./app-errors";

function isValidHttpStatus(status: unknown): status is number {
	return typeof status === "number" && status >= 400 && status <= 599;
}

export function resolveStatusCode(err: unknown): number {
	if (err instanceof HTTPException) {
		return err.status;
	}

	if (err instanceof ServerError) {
		return err.statusCode;
	}

	if (typeof err === "object" && err !== null) {
		const maybeStatusCode = Reflect.get(err, "statusCode");
		if (isValidHttpStatus(maybeStatusCode)) {
			return maybeStatusCode;
		}

		const maybeStatus = Reflect.get(err, "status");
		if (isValidHttpStatus(maybeStatus)) {
			return maybeStatus;
		}

		const maybeCode = Reflect.get(err, "code");

		switch (maybeCode) {
			case "23505": // postgres unique_violation
				return 409;
			case "SQLITE_CONSTRAINT":
				return 409;
			default:
				break;
		}
	}

	return 500;
}
