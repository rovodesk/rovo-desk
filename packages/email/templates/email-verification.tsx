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

interface EmailVerificationLinkTemplateProps {
	readonly url: string;
}

export const EmailVerificationLinkTemplate = ({
	url,
}: EmailVerificationLinkTemplateProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Verify your email address</Preview>

			<Body className="bg-zinc-50 font-sans">
				<Container className="mx-auto px-4 py-12">
					<Section className="mt-8 bg-zinc-200 p-px">
						<Section className="bg-white p-8 md:p-12">
							<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
								Verify your email
							</Text>

							<Text className="m-0 mb-6 text-zinc-500">
								Click the button below to confirm your email address.
							</Text>

							<Section className="my-8 text-center">
								<Button
									className="bg-zinc-950 px-6 py-3 text-center font-semibold text-sm text-zinc-50"
									href={url}
								>
									Verify email
								</Button>
							</Section>

							<Text className="m-0 mb-6 text-sm text-zinc-500">
								This link expires in 10 minutes. If you didn&apos;t create an
								account, you can safely ignore this email.
							</Text>

							<Hr className="my-8 border-zinc-200" />

							<Text className="m-0 text-xs text-zinc-400">
								If the button doesn&apos;t work, copy and paste this URL into
								your browser:
							</Text>

							<Link
								className="mt-2 block break-all font-mono text-xs text-zinc-400"
								href={url}
							>
								{url}
							</Link>

							<Text className="mt-8 text-center text-xs text-zinc-400 uppercase tracking-widest">
								Zero Heads
							</Text>
						</Section>
					</Section>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

export default EmailVerificationLinkTemplate;
