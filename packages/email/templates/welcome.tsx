import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
// biome-ignore lint/correctness/noUnusedImports: Will be used in a runtime with no JSX support
import * as React from "react";

interface UserWelcomeTemplateProps {
	readonly user: {
		name?: string;
		email: string;
	};
	dashboardUrl: string;
}

export const UserWelcomeTemplate = ({
	user,
	dashboardUrl,
}: UserWelcomeTemplateProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Welcome to Zero Heads</Preview>

			<Body className="bg-zinc-50 font-sans">
				<Container className="mx-auto py-12">
					<Section className="mt-8 bg-zinc-200 p-px">
						<Section className="bg-white p-8">
							<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
								Welcome to Zero Heads
							</Text>

							<Text className="m-0 text-zinc-500">
								{user.name ? `Hi ${user.name},` : "Hi there,"}
							</Text>

							<Text className="mt-3 text-zinc-500">
								We’re excited to have you on board. Your account
								<span className="font-medium text-zinc-900">
									{" "}
									({user.email})
								</span>{" "}
								is ready, and you can start exploring Zero Heads right away.
							</Text>

							<Section className="mt-6 text-center">
								<Button
									className="inline-block bg-zinc-900 px-6 py-3 font-semibold text-sm text-white"
									href={dashboardUrl}
								>
									Go to Dashboard
								</Button>
							</Section>

							<Hr className="my-6" />

							<Text className="m-0 text-sm text-zinc-400">
								If you have any questions or need help getting started, just
								reply to this email — we&apos;re happy to help.
							</Text>
						</Section>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

UserWelcomeTemplate.PreviewProps = {
	user: {
		name: "John Doe",
		email: "john.doe@example.com",
	},
	app: {
		name: "Zero Heads",
		dashboardUrl: "https://app.zeroheads.com/",
	},
};

export default UserWelcomeTemplate;
