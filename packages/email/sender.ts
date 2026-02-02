import { pretty, render } from "@react-email/render";
import { Resend } from "resend";
import { keys } from "./keys";

const resend = new Resend(keys.RESEND_TOKEN);

interface SendEmailArgs {
	to: string;
	subject: string;
	react?: React.ReactNode;
	html?: string;
	from?: string;
}

export async function sendEmail({
	from,
	to,
	subject,
	react,
}: SendEmailArgs): Promise<void> {
	try {
		const { data, error } = await resend.emails.send({
			from: from ?? keys.RESEND_FROM ?? "Acme <onboarding@resend.dev>", // "Zero Heads <onboarding@resend.dev>"
			to,
			subject,
			html: await pretty(await render(react)),
		});
		if (error) {
			console.error("Error sending email", {
				error,
			});
		}
		console.log("Email sent", {
			data,
		});
	} catch (error) {
		console.error("Error sending email", {
			error,
		});
	}
}
