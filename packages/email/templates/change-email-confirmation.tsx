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

interface ChangeEmailConfirmationTemplateProps {
	readonly user: {
		email: string;
		name?: string | null;
	};
	readonly newEmail: string;
	readonly url: string;
}

export const ChangeEmailConfirmationTemplate = ({
	user,
	newEmail,
	url,
}: ChangeEmailConfirmationTemplateProps) => {
	const confirmUrl = `${url}`;
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Confirm your new email address</Preview>
				<Body className="bg-zinc-50 font-sans">
					<Container className="mx-auto px-4 py-12">
						<Section className="mt-8 bg-zinc-200 p-px">
							<Section className="bg-white p-8 md:p-12">
								<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
									Confirm email change
								</Text>

								<Text className="m-0 mb-4 text-zinc-500">
									Hi{user.name ? ` ${user.name}` : ""},
								</Text>

								<Text className="m-0 mb-6 text-zinc-500">
									You requested to change the email address on your account from{" "}
									<span className="font-medium text-zinc-700">
										{user.email}
									</span>{" "}
									to{" "}
									<span className="font-medium text-zinc-700">{newEmail}</span>.
								</Text>

								<Text className="m-0 mb-6 text-zinc-500">
									Click the button below to confirm this change.
								</Text>

								<Section className="mt-8 mb-8 text-center">
									<Button
										className="bg-zinc-950 px-6 py-3 text-center font-semibold text-sm text-zinc-50"
										href={confirmUrl}
									>
										Confirm new email
									</Button>
								</Section>

								<Text className="m-0 text-sm text-zinc-500">
									If you didn&apos;t request this change, please ignore this
									email or secure your account.
								</Text>

								<Hr className="my-8 border-zinc-200" />

								<Text className="m-0 text-xs text-zinc-400">
									If the button doesn&apos;t work, copy and paste this URL into
									your browser:
									<br />
									<Link
										className="mt-2 block font-mono text-zinc-400"
										href={confirmUrl}
									>
										{confirmUrl}
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
};

ChangeEmailConfirmationTemplate.PreviewProps = {
	user: { email: "old@zeroheads.com", name: "Alex" },
	newEmail: "new@zeroheads.com",
	url: "https://zeroheads.com/confirm-email?token=123456",
};

export default ChangeEmailConfirmationTemplate;
