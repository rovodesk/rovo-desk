import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createJWKSUrl, decodeJwtToken, verifyJWTToken } from "../lib/jwt";

vi.mock("jose", () => ({
	createRemoteJWKSet: vi.fn(),
	decodeJwt: vi.fn(),
	jwtVerify: vi.fn(),
}));

describe("createJWKSUrl", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("creates a JWKS URL with https when domain has no protocol", () => {
		createJWKSUrl("example.kinde.com");

		expect(createRemoteJWKSet).toHaveBeenCalledTimes(1);
		expect(createRemoteJWKSet).toHaveBeenCalledWith(
			new URL("https://example.kinde.com/.well-known/jwks.json")
		);
	});

	it("uses the provided protocol if domain already has one", () => {
		createJWKSUrl("https://example.kinde.com");

		expect(createRemoteJWKSet).toHaveBeenCalledWith(
			new URL("https://example.kinde.com/.well-known/jwks.json")
		);
	});
});

describe("verifyJWTToken", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("verifies token with normalized domain defaults", async () => {
		const mockJWKS = Symbol("jwks");
		vi.mocked(createRemoteJWKSet).mockReturnValue(mockJWKS as never);
		vi.mocked(jwtVerify).mockResolvedValue({
			payload: {
				sub: "user_123",
				iss: "https://example.kinde.com",
				aud: "https://example.kinde.com",
				exp: 9_999_999_999,
				iat: 1_111_111_111,
			},
		} as never);

		const payload = await verifyJWTToken("token_123", {
			domain: "example.kinde.com",
		});

		expect(createRemoteJWKSet).toHaveBeenCalledWith(
			new URL("https://example.kinde.com/.well-known/jwks.json")
		);

		expect(jwtVerify).toHaveBeenCalledWith("token_123", mockJWKS, {
			issuer: "https://example.kinde.com",
			audience: "https://example.kinde.com",
		});

		expect(payload).toEqual({
			sub: "user_123",
			iss: "https://example.kinde.com",
			aud: "https://example.kinde.com",
			exp: 9_999_999_999,
			iat: 1_111_111_111,
		});
	});

	it("uses custom audience and issuer when provided", async () => {
		const mockJWKS = Symbol("jwks");
		vi.mocked(createRemoteJWKSet).mockReturnValue(mockJWKS as never);
		vi.mocked(jwtVerify).mockResolvedValue({
			payload: {
				sub: "user_123",
				iss: "https://issuer.example.com",
				aud: "api://my-api",
				exp: 9_999_999_999,
				iat: 1_111_111_111,
			},
		} as never);

		await verifyJWTToken("token_123", {
			domain: "example.kinde.com",
			audience: "api://my-api",
			issuer: "https://issuer.example.com",
		});

		expect(jwtVerify).toHaveBeenCalledWith("token_123", mockJWKS, {
			issuer: "https://issuer.example.com",
			audience: "api://my-api",
		});
	});
});

describe("decodeJwtToken", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("decodes the token payload", () => {
		vi.mocked(decodeJwt).mockReturnValue({
			sub: "user_123",
			iss: "issuer",
			aud: "audience",
			exp: 123,
			iat: 456,
		} as never);

		const result = decodeJwtToken("token_123");

		expect(decodeJwt).toHaveBeenCalledWith("token_123");
		expect(result).toEqual({
			sub: "user_123",
			iss: "issuer",
			aud: "audience",
			exp: 123,
			iat: 456,
		});
	});
});
