import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
	},
	auth: {
		loginWithUsername: {
			allowEmailLogin: true, // default: false
			requireEmail: false, // default: false
		},
	},
	fields: [
		// Email added by default
		// Add more fields as needed
	],
};
