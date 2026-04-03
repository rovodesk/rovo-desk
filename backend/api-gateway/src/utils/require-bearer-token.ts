import { AuthenticationError } from "@zero-heads-lab/global/errors";

export function requireBearerToken(request: Request): string {
	const auth =
		request.headers.get("authorization") ??
		request.headers.get("Authorization");

	if (!auth) {
		throw new AuthenticationError("Missing authorization header", 401);
	}

	const [scheme, token] = auth.trim().split(/\s+/, 2);

	if (!scheme || scheme.toLowerCase() !== "bearer") {
		throw new AuthenticationError("Invalid authorization scheme", 401);
	}

	if (!token) {
		throw new AuthenticationError("Missing authorization token", 401);
	}

	return token;
}
