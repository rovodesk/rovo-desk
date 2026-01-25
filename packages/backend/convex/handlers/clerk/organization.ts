import { internal } from "../../_generated/api";
import { httpAction } from "../../_generated/server";
import { validateRequest } from "../../utils";

export const handleClerkOrganizationWebhooks = httpAction(
	async (ctx, request) => {
		const event = await validateRequest(request);
		if (!event) {
			return new Response("Unauthorized", { status: 400 });
		}

		console.log("Clerk webhook event", event.type);

		switch (event.type) {
			case "organization.created": {
				const { id, name, slug, image_url, has_image, created_by } = event.data;
				// TODO: ADD a good logo placeholder API
				let imageUrl = "https://placehold.co/64x64";
				if (has_image) {
					imageUrl = image_url;
				}

				await ctx.runMutation(
					internal.functions.organizations.createDomainFromWebhook,
					{
						clerkId: id,
						name,
						slug,
						ownerId: created_by,
						imageUrl,
					}
				);
				break;
			}
			default: {
				console.log("ignored Clerk webhook event", event.type);
			}
		}
		return new Response(null, { status: 200 });
	}
);
