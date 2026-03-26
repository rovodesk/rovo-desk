// import { createMockAnalytics } from "@zero-heads-lab/analytics/test/mocks/analytics";
// import { createMockLogger } from "@zero-heads-lab/analytics/test/mocks/logger";
// import { createMockTracer } from "@zero-heads-lab/analytics/test/mocks/tracer";
// import { createMockKvCacheStore } from "@zero-heads-lab/cache/test/mocks/cache-store";
// import { getTestDb } from "@zero-heads-lab/database/test/setup/conn";
// import { describe, expect, test, vi } from "vitest";
// import { createAuth } from "../../server";

// type BetterAuthTestContext = {
// 	test: {
// 		createUser: (input: {
// 			email: string;
// 			name?: string;
// 			image?: string;
// 		}) => Promise<unknown>;
// 	};
// };

// vi.mock("@zero-heads-lab/email", () => ({
// 	sendEmail: vi.fn(() => {
// 		console.log("Email sent");
// 	}),
// }));

// describe("signup flow tests", () => {
// 	test("creates workspace profile and widget after signup", async () => {
// 		const { db } = await getTestDb();
// 		const auth = await createAuth(
// 			createMockKvCacheStore(),
// 			db,
// 			createMockAnalytics(),
// 			createMockLogger(),
// 			createMockTracer()
// 		);

// 		const ctx = (await auth.$context) as typeof auth.$context extends Promise<
// 			infer T
// 		>
// 			? T & BetterAuthTestContext
// 			: BetterAuthTestContext;

// 		const email = `test-${crypto.randomUUID()}@example.com`;
// 		const image = "https://cdn.example.com/logo.png";

// 		await ctx.test.createUser({
// 			email,
// 			name: "Dev Test",
// 			image,
// 		});

// 		const user = await db.query.user.findFirst({
// 			where: (u, { eq }) => eq(u.email, email),
// 		});
// 		if (!user) {
// 			throw new Error("User was not created");
// 		}
// 		const userProfile = await db.query.userProfile.findFirst({
// 			where: (up, { eq }) => eq(up.userId, user.id),
// 		});

// 		expect(userProfile).toBeTruthy();
// 		expect(userProfile?.userId).toBe(user.id);
// 	});
// });
