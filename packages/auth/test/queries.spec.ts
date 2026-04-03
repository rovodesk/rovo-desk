import {
	getCurrentOrganization,
	getUserOrganizations,
} from "@kinde-oss/kinde-auth-react/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { organizationKeys, organizationsQueryOptions } from "../lib/queries";

vi.mock("@kinde-oss/kinde-auth-react/utils", () => ({
	getCurrentOrganization: vi.fn(),
	getUserOrganizations: vi.fn(),
}));

describe("organizationKeys", () => {
	it("returns stable keys", () => {
		expect(organizationKeys.all).toEqual(["organizations"]);
		expect(organizationKeys.current()).toEqual(["organizations", "current"]);
		expect(organizationKeys.list()).toEqual(["organizations", "list"]);
	});
});

const queryFnArgs = {
	queryKey: ["organizations"],
	signal: new AbortController().signal,
	meta: undefined,
} as never;

describe("organizationsQueryOptions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns correct query config", () => {
		const options = organizationsQueryOptions();

		expect(options.queryKey).toEqual(["organizations"]);
		expect(options.staleTime).toBe(5 * 60 * 1000);
		expect(options.gcTime).toBe(10 * 60 * 1000);
		expect(options.retry).toBe(false);
		expect(typeof options.queryFn).toBe("function");
	});

	it("returns current organization and organizations list", async () => {
		vi.mocked(getCurrentOrganization).mockResolvedValue({
			orgCode: "org_1",
			orgName: "Acme",
		} as never);

		vi.mocked(getUserOrganizations).mockResolvedValue([
			{ orgCode: "org_1", orgName: "Acme" },
			{ orgCode: "org_2", orgName: "Beta" },
		] as never);

		const options = organizationsQueryOptions();
		const result = await options.queryFn?.(queryFnArgs);

		expect(result).toEqual({
			currentOrganization: {
				orgCode: "org_1",
				orgName: "Acme",
			},
			organizations: [
				{ orgCode: "org_1", orgName: "Acme" },
				{ orgCode: "org_2", orgName: "Beta" },
			],
		});
	});

	it("normalizes undefined values to null/empty array", async () => {
		vi.mocked(getCurrentOrganization).mockResolvedValue(undefined as never);
		vi.mocked(getUserOrganizations).mockResolvedValue(undefined as never);

		const options = organizationsQueryOptions();
		const result = await options.queryFn?.(queryFnArgs);
		expect(result).toEqual({
			currentOrganization: null,
			organizations: [],
		});
	});

	it("calls both Kinde organization helpers", async () => {
		vi.mocked(getCurrentOrganization).mockResolvedValue(undefined as never);
		vi.mocked(getUserOrganizations).mockResolvedValue([] as never);

		const options = organizationsQueryOptions();
		await options.queryFn?.(queryFnArgs);

		expect(getCurrentOrganization).toHaveBeenCalledTimes(1);
		expect(getUserOrganizations).toHaveBeenCalledTimes(1);
	});
});
