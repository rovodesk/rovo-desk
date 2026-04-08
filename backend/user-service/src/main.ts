import { config } from "dotenv";
import { author, version } from "../package.json";

config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Setup Docs
	if (process.env.NODE_ENV !== "production") {
		const { setupDocs } = await import("@zero-heads-lab/global/documentation");
		setupDocs(app, {
			title: "RovoDesk Auth API",
			description: "Authentication and identity API for RovoDesk",
			version,
			serverUrl: "http://localhost:5001",
			bearerAuth: true,
			path: "docs",
			referencePath: "reference",
			tags: ["Auth Service"],
			contactName: author.name,
			contactEmail: author.email,
		});
	}

	await app.listen(
		process.env.HOSTNAME
			? `${process.env.HOSTNAME}:${process.env.PORT ?? 5001}`
			: (process.env.PORT ?? 5001)
	);
	console.log(`Auth Service is running on port ${process.env.PORT ?? 5001}`);
	console.log(
		`Docs available at http://localhost:${process.env.PORT ?? 5001}/docs`
	);
	console.log(
		`Reference available at http://localhost:${process.env.PORT ?? 5001}/reference`
	);
}
bootstrap();
