import { httpRouter } from "convex/server";
import { handleClerkOrganizationWebhooks } from "./handlers/clerk/organization";

const http = httpRouter();

http.route({
	path: "/clerk-organization-webhooks",
	method: "POST",
	handler: handleClerkOrganizationWebhooks,
});

export default http;
