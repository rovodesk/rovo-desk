import { BodyValidationError } from "@zero-heads-lab/global/utils";

export function requireBearerToken(request: Request): string {
	const auth = request.headers.get("Authorization");

	if (!auth?.startsWith("Bearer ")) {
		throw new BodyValidationError("Missing authorization header", 401);
	}

	const token = auth.split(" ")[1];

	if (!token) {
		throw new BodyValidationError("Missing authorization token", 401);
	}

	return token;
}
