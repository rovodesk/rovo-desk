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

interface MagicLinkTemplateProps {
	readonly url: string;
}

export const MagicLinkTemplate = ({ url }: MagicLinkTemplateProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Sign in to Zero Heads</Preview>
			<Body className="bg-zinc-50 font-sans">
				<Container className="mx-auto px-4 py-12">
					<Section className="mt-8 bg-zinc-200 p-px">
						<Section className="bg-white p-8 md:p-12">
							<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
								Sign in
							</Text>
							<Text className="m-0 mb-6 text-zinc-500">
								Click the button below to sign in to your account.
							</Text>
							<Section className="mt-8 mb-8 text-center">
								<Button
									className="bg-zinc-950 px-6 py-3 text-center font-semibold text-sm text-zinc-50"
									href={url}
								>
									Sign in
								</Button>
							</Section>
							<Text className="m-0 text-sm text-zinc-500">
								If you didn't request this email, you can safely ignore it.
							</Text>
							<Hr className="my-8 border-zinc-200" />
							<Text className="m-0 text-xs text-zinc-400">
								If the button doesn't work, copy and paste this URL into your
								browser:
								<br />
								<Link className="mt-2 block font-mono text-zinc-400" href={url}>
									{url}
								</Link>
							</Text>
						</Section>
					</Section>
					<Text className="mt-8 text-center text-xs text-zinc-400 uppercase tracking-widest">
						Zero Heads
					</Text>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

MagicLinkTemplate.PreviewProps = {
	url: "https://zeroheads.com/verify?token=123456",
};

export default MagicLinkTemplate;
