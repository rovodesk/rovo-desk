import {
	Body,
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

interface AccountDeletedVerificationTemplateProps {
	readonly url: string;
}

export const AccountDeleteVerifiactionTemplate = ({
	url,
}: AccountDeletedVerificationTemplateProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Account Getting Deleted</Preview>

			<Body className="bg-zinc-50 font-sans">
				<Container className="mx-auto py-12">
					<Section className="mt-8 bg-zinc-200 p-px">
						<Section className="bg-white p-8">
							<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
								Yout Account is being Deleted
							</Text>

							<Text className="m-0 text-zinc-500">
								Click on this link to confirm {url}
							</Text>

							<Text className="mt-3 text-zinc-500">
								We’re sorry to see you go. Your account has been deleted.
							</Text>

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

AccountDeleteVerifiactionTemplate.PreviewProps = {
	url: "https://zeroheads.com/delete?token=123456",
};

export default AccountDeleteVerifiactionTemplate;
