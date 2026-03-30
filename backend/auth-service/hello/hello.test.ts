import { describe, expect, test } from "vitest";
import { getHelloMessage } from "./hello";

describe("getHelloMessage", () => {
	test("should combine string with parameter value", () => {
		const resp = getHelloMessage("world");
		expect(resp.message).toBe("Hello world!");
	});
});
