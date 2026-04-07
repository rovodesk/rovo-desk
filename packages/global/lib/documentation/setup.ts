import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import type { Request, Response } from "express";

export type SwaggerSetupOptions = {
	title: string;
	description: string;
	version: string;
	serverUrl?: string;
	bearerAuth?: boolean;
	path?: string;
	tags?: string[];
	referencePath?: string;
	// Expanded Metadata
	contactName?: string;
	contactEmail?: string;
	contactUrl?: string;
	licenseName?: string;
	licenseUrl?: string;
	externalDocDescription?: string;
	externalDocUrl?: string;
};

export function setupDocs(
	app: INestApplication,
	{
		title,
		description,
		version,
		serverUrl,
		bearerAuth = true,
		path = "docs",
		referencePath = "reference",
		tags = ["API"],
		contactName,
		contactEmail,
		contactUrl,
		licenseName,
		licenseUrl,
		externalDocDescription,
		externalDocUrl,
	}: SwaggerSetupOptions
) {
	const builder = new DocumentBuilder()
		.setTitle(title)
		.setDescription(description)
		.setVersion(version);

	// Metadata Configuration
	if (contactName || contactEmail || contactUrl) {
		builder.setContact(contactName ?? "", contactUrl ?? "", contactEmail ?? "");
	}

	if (licenseName) {
		builder.setLicense(licenseName, licenseUrl ?? "");
	}

	if (externalDocUrl) {
		builder.setExternalDoc(
			externalDocDescription ?? "Find out more",
			externalDocUrl
		);
	}

	// Server & Tags
	if (serverUrl) {
		builder.addServer(serverUrl);
	}

	tags.forEach((tag) => builder.addTag(tag));

	// Security
	if (bearerAuth) {
		builder.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				description: "Enter your JWT access token",
				in: "header",
			},
			"bearer"
		);
	}

	const document = SwaggerModule.createDocument(app, builder.build());

	/**
	 * Raw OpenAPI Endpoints (Express Typed)
	 */
	app.use(`/${path}-json`, (_req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(JSON.stringify(document));
	});

	app.use(`/${path}-yaml`, async (_req: Request, res: Response) => {
		const { dump } = await import("js-yaml");
		res.type("text/yaml").send(dump(document));
	});

	/**
	 * Navigation
	 */
	app.use(`/${path}`, (_req: Request, res: Response) => {
		res.redirect(`/${referencePath}`);
	});

	/**
	 * Scalar Reference UI
	 */
	app.use(
		`/${referencePath}`,
		apiReference({
			content: document,
			theme: "deepSpace",
			layout: "modern",
			isEditable: false,
			persistAuth: true,
			orderRequiredPropertiesFirst: true,
			showOperationId: true,
			_integration: "nestjs",
			showDeveloperTools: "localhost",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
			title: `${title} API Reference`,
			slug: `${title.toLowerCase().replace(/\s+/g, "-")}-api-reference`,
		})
	);

	return document;
}
