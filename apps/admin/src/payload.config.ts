import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { Hero } from "./collections/blocks/Hero";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		autoLogin:
			process.env.NODE_ENV === "development"
				? {
						email: "admin@example.com",
						password: "Password",
						username: "auto_login_dev_user",
						prefillOnly: true,
					}
				: false,
	},
	collections: [Users, Media, Pages],
	blocks: [Hero],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: mongooseAdapter({
		url: process.env.DATABASE_URL || "",
	}),
	sharp,
	plugins: [],
	csrf: ["http://localhost:3000"],
	cors: ["http://localhost:3000"],
});
