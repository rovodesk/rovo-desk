// import { beforeEach, describe, expect, it, vi } from "vitest";

// // --- Mocks that must exist BEFORE importing the module under test ---
// const mockJwtVerify = vi.fn();
// const mockCreateRemoteJWKSet = vi.fn(() => "mock-jwks");

// vi.mock("jose", () => ({
// 	createRemoteJWKSet: () => mockCreateRemoteJWKSet(),
// 	jwtVerify: () => mockJwtVerify(),
// }));

// vi.mock("./config", () => ({
// 	AUTH_CONFIG: {
// 		JWKS_URL: "https://example.com/.well-known/jwks.json",
// 		JWT_ISSUER: "https://issuer.example.com",
// 		JWT_AUDIENCE: "my-audience",
// 		JWT_ALGORITHM: "RS256",
// 	},
// }));

// // Mock access-control so tests don't depend on external constants
// vi.mock("./access-control", () => ({
// 	AppAccessRoles: ["owner", "admin", "member", "user", "demoUser", "betaUser"],
// }));

// import {
// 	checkDomainSlug,
// 	determineAuthRoles,
// 	generateSlug,
// 	getDeviceInfo,
// 	hasAppAccess,
// 	isValidApiKey,
// 	validateAuthToken,
// 	validateSession,
// } from "../../helpers";

// describe("validateSession", () => {
// 	const now = new Date();

// 	it("returns no_session when session is null", () => {
// 		expect(validateSession(null)).toEqual({
// 			valid: false,
// 			reason: "no_session",
// 		});
// 	});

// 	it("returns expired when session is expired", () => {
// 		const session = {
// 			session: {
// 				expiresAt: new Date(now.getTime() - 60_000),
// 			},
// 			user: {
// 				emailVerified: true,
// 				deletedAt: null,
// 			},
// 		} as any;

// 		expect(validateSession(session)).toEqual({
// 			valid: false,
// 			reason: "expired",
// 		});
// 	});

// 	it("returns unverified when email is not verified", () => {
// 		const session = {
// 			session: {
// 				expiresAt: new Date(now.getTime() + 60_000),
// 			},
// 			user: {
// 				emailVerified: false,
// 				deletedAt: null,
// 			},
// 		} as any;

// 		expect(validateSession(session)).toEqual({
// 			valid: false,
// 			reason: "unverified",
// 		});
// 	});

// 	it("returns deleted when user is soft deleted", () => {
// 		const session = {
// 			session: {
// 				expiresAt: new Date(now.getTime() + 60_000),
// 			},
// 			user: {
// 				emailVerified: true,
// 				deletedAt: new Date(),
// 			},
// 		} as any;

// 		expect(validateSession(session)).toEqual({
// 			valid: false,
// 			reason: "deleted",
// 		});
// 	});

// 	it("returns valid when session is active, verified, and not deleted", () => {
// 		const session = {
// 			session: {
// 				expiresAt: new Date(now.getTime() + 60_000),
// 			},
// 			user: {
// 				emailVerified: true,
// 				deletedAt: null,
// 			},
// 		} as any;

// 		expect(validateSession(session)).toEqual({
// 			valid: true,
// 			session,
// 		});
// 	});
// });

// describe("getDeviceInfo", () => {
// 	it("returns unknown device for empty user agent", () => {
// 		expect(getDeviceInfo()).toMatchObject({
// 			label: "Unknown device",
// 		});
// 	});

// 	it("detects mobile devices", () => {
// 		const result = getDeviceInfo(
// 			"Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
// 		);

// 		expect(result).toMatchObject({
// 			label: "Mobile device",
// 		});
// 	});

// 	it("detects browser user agents", () => {
// 		const result = getDeviceInfo(
// 			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/123.0 Safari/537.36"
// 		);

// 		expect(result).toMatchObject({
// 			label: "Browser",
// 		});
// 	});

// 	it("detects desktop device if not browser but desktop OS present", () => {
// 		const result = getDeviceInfo("Windows NT 10.0");

// 		expect(result).toMatchObject({
// 			label: "Desktop device",
// 		});
// 	});

// 	it("falls back to unknown for unrecognized UA", () => {
// 		const result = getDeviceInfo("some-random-agent");

// 		expect(result).toMatchObject({
// 			label: "Unknown device",
// 		});
// 	});
// });

// describe("generateSlug", () => {
// 	it("lowercases and trims", () => {
// 		expect(generateSlug("  Hello World  ")).toBe("hello-world");
// 	});

// 	it("replaces multiple spaces with single hyphen", () => {
// 		expect(generateSlug("hello    world   again")).toBe("hello-world-again");
// 	});

// 	it("removes non-alphanumeric characters except hyphen", () => {
// 		expect(generateSlug("Hello @ World!!!")).toBe("hello--world");
// 	});

// 	it("keeps numbers", () => {
// 		expect(generateSlug("Plan 2026")).toBe("plan-2026");
// 	});

// 	it("returns empty string for only symbols", () => {
// 		expect(generateSlug("!!!@@@###")).toBe("");
// 	});
// });

// describe("checkDomainSlug", () => {
// 	it("returns status when auth client succeeds", async () => {
// 		const authClient = {
// 			organization: {
// 				checkSlug: vi.fn().mockResolvedValue({
// 					data: { status: true },
// 					error: null,
// 				}),
// 			},
// 		} as any;

// 		await expect(checkDomainSlug(authClient, "my-slug")).resolves.toBe(true);
// 		expect(authClient.organization.checkSlug).toHaveBeenCalledWith({
// 			slug: "my-slug",
// 		});
// 	});

// 	it("throws when auth client returns error", async () => {
// 		const authClient = {
// 			organization: {
// 				checkSlug: vi.fn().mockResolvedValue({
// 					data: null,
// 					error: new Error("slug service failed"),
// 				}),
// 			},
// 		} as any;

// 		await expect(checkDomainSlug(authClient, "bad-slug")).rejects.toThrow(
// 			"slug service failed"
// 		);
// 	});
// });

// describe("validateAuthToken", () => {
// 	beforeEach(() => {
// 		vi.clearAllMocks();
// 	});

// 	it("returns payload when jwtVerify succeeds", async () => {
// 		mockJwtVerify.mockResolvedValue({
// 			payload: { sub: "user_123", email: "test@example.com" },
// 		});

// 		await expect(validateAuthToken("valid-token")).resolves.toEqual({
// 			sub: "user_123",
// 			email: "test@example.com",
// 		});

// 		expect(mockJwtVerify).toHaveBeenCalledWith(
// 			"valid-token",
// 			"mock-jwks",
// 			expect.objectContaining({
// 				issuer: "https://issuer.example.com",
// 				audience: "my-audience",
// 				algorithms: ["RS256"],
// 			})
// 		);
// 	});

// 	it("throws Unauthorized when jwtVerify fails", async () => {
// 		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
// 			//Ignore
// 		});
// 		mockJwtVerify.mockRejectedValue(new Error("bad token"));

// 		await expect(validateAuthToken("invalid-token")).rejects.toThrow(
// 			"Unauthorized"
// 		);

// 		expect(errorSpy).toHaveBeenCalled();
// 		errorSpy.mockRestore();
// 	});
// });

// describe("determineAuthRoles", () => {
// 	it("returns empty array for undefined role", () => {
// 		expect(determineAuthRoles()).toEqual([]);
// 	});

// 	it("parses single role", () => {
// 		expect(determineAuthRoles("owner")).toEqual(["owner"]);
// 	});

// 	it("parses multiple roles separated by spaces", () => {
// 		expect(determineAuthRoles("owner admin member")).toEqual([
// 			"owner",
// 			"admin",
// 			"member",
// 		]);
// 	});

// 	it("parses multiple roles separated by commas", () => {
// 		expect(determineAuthRoles("owner,admin,member")).toEqual([
// 			"owner",
// 			"admin",
// 			"member",
// 		]);
// 	});

// 	it("normalizes casing", () => {
// 		expect(determineAuthRoles("Owner ADMIN demoUser betaUser")).toEqual([
// 			"owner",
// 			"admin",
// 			"demoUser",
// 			"betaUser",
// 		]);
// 	});

// 	it("maps unknown roles to anonymous", () => {
// 		expect(determineAuthRoles("superadmin")).toEqual(["anonymous"]);
// 	});

// 	it("deduplicates repeated roles", () => {
// 		expect(determineAuthRoles("owner owner OWNER admin")).toEqual([
// 			"owner",
// 			"admin",
// 		]);
// 	});

// 	it("maps known special roles correctly", () => {
// 		expect(determineAuthRoles("demouser betauser anonymous user")).toEqual([
// 			"demoUser",
// 			"betaUser",
// 			"anonymous",
// 			"user",
// 		]);
// 	});
// });

// describe("hasAppAccess", () => {
// 	it("returns true for allowed roles", () => {
// 		expect(hasAppAccess("owner")).toBe(true);
// 		expect(hasAppAccess("admin")).toBe(true);
// 		expect(hasAppAccess("demoUser")).toBe(true);
// 	});

// 	it("returns false for disallowed roles", () => {
// 		expect(hasAppAccess("anonymous")).toBe(false);
// 	});
// });

// describe("isValidApiKey", () => {
// 	it("returns false if id is missing", () => {
// 		expect(isValidApiKey({ enabled: true })).toBe(false);
// 	});

// 	it("returns false if key is disabled", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: false,
// 			})
// 		).toBe(false);
// 	});

// 	it("returns false if expired", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 				expiresAt: new Date(Date.now() - 60_000),
// 			})
// 		).toBe(false);
// 	});

// 	it("returns false if remaining is 0", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 				remaining: 0,
// 			})
// 		).toBe(false);
// 	});

// 	it("returns false if remaining is negative", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 				remaining: -1,
// 			})
// 		).toBe(false);
// 	});

// 	it("returns true when key is valid with no expiry and no remaining limit", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 			})
// 		).toBe(true);
// 	});

// 	it("returns true when remaining is positive", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 				remaining: 10,
// 			})
// 		).toBe(true);
// 	});

// 	it("returns true when expiresAt is in the future", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 				expiresAt: new Date(Date.now() + 60_000),
// 			})
// 		).toBe(true);
// 	});

// 	it("treats remaining: null as valid", () => {
// 		expect(
// 			isValidApiKey({
// 				id: "key_1",
// 				enabled: true,
// 				remaining: null,
// 			})
// 		).toBe(true);
// 	});
// });
