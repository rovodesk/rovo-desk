import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
// biome-ignore lint/correctness/noUnusedImports: Will be used in a runtime with no JSX support
import * as React from "react";

interface WorkspaceInviteTemplateProps {
	readonly inviter: { name: string; email: string };
	readonly organization: { name: string; slug: string };
	readonly email: string;
	readonly invitation: { id: string };
	readonly acceptLink?: string;
}

export const WorkspaceInviteTemplate = ({
	inviter,
	organization,
	email,
	invitation,
	acceptLink,
}: WorkspaceInviteTemplateProps) => {
	if (!acceptLink) {
		acceptLink = `https://app.zeroheads.com/org/${organization.slug}/invite/${invitation.id}`;
	}

	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>You’ve been invited to join {organization.name}</Preview>

				<Body className="bg-zinc-50 font-sans">
					<Container className="mx-auto py-12">
						<Section className="mt-8 bg-zinc-200 p-px">
							<Section className="bg-white p-8">
								<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
									You’re invited to join {organization.name}
								</Text>

								<Text className="m-0 text-zinc-500">
									{inviter.name} ({inviter.email}) has invited you to join the
									organization{" "}
									<span className="font-medium text-zinc-900">
										{organization.name}
									</span>
									<span className="text-zinc-500"> ({organization.slug})</span>.
								</Text>

								<Hr className="my-4" />

								<Text className="m-0 text-zinc-500">
									This invitation was sent to{" "}
									<span className="font-medium">{email}</span>. Click the button
									below to accept the invitation and get started.
									<br />
									You will be redirected to the organization dashboard.
								</Text>

								<Section className="mt-6 text-center">
									<Button
										className="inline-block bg-zinc-900 px-6 py-3 font-semibold text-sm text-white"
										href={acceptLink}
									>
										Accept Invitation
									</Button>
								</Section>

								<Section className="mt-6 text-center">
									<Text className="m-0 text-xs text-zinc-400">
										If the button doesn't work, copy and paste this URL into
										your browser:
										<br />
										<Link
											className="mt-2 block font-mono text-zinc-400"
											href={acceptLink}
										>
											{acceptLink}
										</Link>
									</Text>
								</Section>

								<Hr className="my-6" />

								<Text className="m-0 text-center text-sm text-zinc-400">
									If you weren&apos;t expecting this invitation, you can safely
									ignore this email.
								</Text>
							</Section>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};

WorkspaceInviteTemplate.PreviewProps = {
	inviter: {
		name: "Jane Smith",
		email: "jane.smith@acme.com",
	},
	organization: {
		name: "Acme Inc.",
		slug: "acme-inc",
	},
	email: "john.doe@example.com",
	invitation: {
		id: "abc123",
	},
};

export default WorkspaceInviteTemplate;
