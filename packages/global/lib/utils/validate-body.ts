import { ValidationError } from "lib/errors";
import type { ZodType, z } from "zod";

export type BodyKind = "json" | "text" | "form" | "multipart" | "binary";

export type ParsedRequestBody =
	| {
			kind: "json";
			contentType: string;
			raw: string;
			data: unknown;
	  }
	| {
			kind: "text";
			contentType: string;
			raw: string;
			data: string;
	  }
	| {
			kind: "form";
			contentType: string;
			raw: string;
			data: Record<string, string | string[]>;
	  }
	| {
			kind: "multipart";
			contentType: string;
			raw: string;
			data: Record<string, FormDataEntryValue | FormDataEntryValue[]>;
	  }
	| {
			kind: "binary";
			contentType: string;
			raw: string;
			data: ArrayBuffer;
	  };

export type ValidatedBody<T = unknown, TKind extends BodyKind = BodyKind> = {
	kind: TKind;
	contentType: string;
	raw: string;
	data: T;
};

type ValidateBodyOptions<TSchema extends ZodType | undefined = undefined> = {
	expected?: BodyKind;
	schema?: TSchema;
};

function normalizeContentType(contentType: string | null): string {
	return (contentType ?? "").split(";")[0].trim().toLowerCase();
}

function formDataToObject(
	formData: FormData
): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
	const result: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

	for (const [key, value] of formData.entries()) {
		const existing = result[key];

		if (existing === undefined) {
			result[key] = value;
			continue;
		}

		if (Array.isArray(existing)) {
			existing.push(value);
			continue;
		}

		result[key] = [existing, value];
	}

	return result;
}

function urlSearchParamsToObject(
	params: URLSearchParams
): Record<string, string | string[]> {
	const result: Record<string, string | string[]> = {};

	for (const [key, value] of params.entries()) {
		const existing = result[key];

		if (existing === undefined) {
			result[key] = value;
			continue;
		}

		if (Array.isArray(existing)) {
			existing.push(value);
			continue;
		}

		result[key] = [existing, value];
	}

	return result;
}

function stableStringify(value: unknown): string {
	if (value === null || typeof value !== "object") {
		return JSON.stringify(value);
	}

	if (Array.isArray(value)) {
		return `[${value.map(stableStringify).join(",")}]`;
	}

	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b)
	);

	return `{${entries
		.map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`)
		.join(",")}}`;
}

/**
 * Read and normalize a request body into a canonical form.
 * Useful for:
 * - hashing / idempotency
 * - content-type aware parsing
 * - webhook ingestion
 */
export async function readBody(request: Request): Promise<ParsedRequestBody> {
	const contentType = normalizeContentType(request.headers.get("content-type"));
	const clone = request.clone();

	if (contentType === "application/json") {
		const rawText = await clone.text();

		let data: unknown;
		try {
			data = rawText.length > 0 ? JSON.parse(rawText) : null;
		} catch {
			throw new ValidationError("Invalid JSON body", 400);
		}

		return {
			kind: "json",
			contentType,
			raw: rawText.length > 0 ? stableStringify(data) : "",
			data,
		};
	}

	if (contentType === "application/x-www-form-urlencoded") {
		const raw = await clone.text();
		const params = new URLSearchParams(raw);

		return {
			kind: "form",
			contentType,
			raw,
			data: urlSearchParamsToObject(params),
		};
	}

	if (contentType === "multipart/form-data") {
		const formData = await clone.formData();
		const data = formDataToObject(formData);

		const serializable = Object.fromEntries(
			Object.entries(data).map(([key, value]) => {
				const normalizeEntry = (entry: FormDataEntryValue) => {
					if (typeof entry === "string") return entry;

					return {
						name: entry.name,
						type: entry.type,
						size: entry.size,
					};
				};

				if (Array.isArray(value)) {
					return [key, value.map(normalizeEntry)];
				}

				return [key, normalizeEntry(value)];
			})
		);

		return {
			kind: "multipart",
			contentType,
			raw: stableStringify(serializable),
			data,
		};
	}

	if (contentType.startsWith("text/") || contentType === "application/xml") {
		const raw = await clone.text();

		return {
			kind: "text",
			contentType,
			raw,
			data: raw,
		};
	}

	const buffer = await clone.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	const raw = Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return {
		kind: "binary",
		contentType,
		raw,
		data: buffer,
	};
}

function assertExpectedKind(actual: BodyKind, expected: BodyKind) {
	if (actual !== expected) {
		const expectedMap: Record<BodyKind, string> = {
			json: "application/json",
			text: "text/* or application/xml",
			form: "application/x-www-form-urlencoded",
			multipart: "multipart/form-data",
			binary: "binary body",
		};

		throw new ValidationError(
			`Expected ${expectedMap[expected]} but received ${actual}`,
			415
		);
	}
}

/**
 * Read, optionally constrain by expected kind, and optionally validate using Zod.
 */
export async function validateRequestBody<
	TSchema extends ZodType | undefined = undefined,
	TExpected extends BodyKind | undefined = undefined,
>(
	request: Request,
	options?: ValidateBodyOptions<TSchema> & { expected?: TExpected }
): Promise<
	ValidatedBody<
		TSchema extends ZodType
			? z.infer<TSchema>
			: TExpected extends "json"
				? unknown
				: TExpected extends "text"
					? string
					: TExpected extends "form"
						? Record<string, string | string[]>
						: TExpected extends "multipart"
							? Record<string, FormDataEntryValue | FormDataEntryValue[]>
							: TExpected extends "binary"
								? ArrayBuffer
								: unknown,
		TExpected extends BodyKind ? TExpected : BodyKind
	>
> {
	const parsed = await readBody(request);
	const expected = options?.expected;
	const schema = options?.schema;

	if (expected) {
		assertExpectedKind(parsed.kind, expected);
	}

	const data = schema ? schema.parse(parsed.data) : parsed.data;

	return {
		kind: (expected ?? parsed.kind) as TExpected extends BodyKind
			? TExpected
			: BodyKind,
		contentType: parsed.contentType,
		raw: parsed.raw,
		data: data as TSchema extends ZodType
			? z.infer<TSchema>
			: TExpected extends "json"
				? unknown
				: TExpected extends "text"
					? string
					: TExpected extends "form"
						? Record<string, string | string[]>
						: TExpected extends "multipart"
							? Record<string, FormDataEntryValue | FormDataEntryValue[]>
							: TExpected extends "binary"
								? ArrayBuffer
								: unknown,
	};
}
