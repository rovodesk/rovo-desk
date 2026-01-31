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

interface LoginAlertTemplateProps {
	readonly ipAddress?: string;
	readonly userAgent?: string;
	readonly time: string;
	readonly securityUrl?: string;
}

export const LoginAlertTemplate = ({
	ipAddress,
	userAgent,
	time,
	securityUrl,
}: LoginAlertTemplateProps) => {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>New login to your account</Preview>

				<Body className="bg-zinc-50 font-sans">
					<Container className="mx-auto px-4 py-12">
						<Section className="mt-8 bg-zinc-200 p-px">
							<Section className="bg-white p-8 md:p-12">
								<Text className="mt-0 mb-4 font-semibold text-2xl text-zinc-950">
									New login detected
								</Text>

								<Text className="m-0 mb-6 text-zinc-500">
									We noticed a new sign-in to your account. Here are the
									details:
								</Text>

								<Section className="mb-6 rounded-md bg-zinc-50 p-4">
									<Text className="m-0 mb-2 text-sm text-zinc-600">
										<strong>Time:</strong> {time}
									</Text>
									<Text className="m-0 mb-2 text-sm text-zinc-600">
										<strong>IP address:</strong> {ipAddress}
									</Text>
									<Text className="m-0 text-sm text-zinc-600">
										<strong>Device:</strong> {userAgent}
									</Text>
								</Section>

								<Text className="m-0 mb-6 text-zinc-500">
									If this was you, no further action is required.
								</Text>

								<Text className="m-0 mb-6 text-zinc-500">
									If you don’t recognize this activity, we recommend securing
									your account immediately.
								</Text>

								{securityUrl ? (
									<Section className="mt-8 mb-8 text-center">
										<Button
											className="bg-zinc-950 px-6 py-3 text-center font-semibold text-sm text-zinc-50"
											href={securityUrl}
										>
											Review security activity
										</Button>
									</Section>
								) : null}

								<Hr className="my-8 border-zinc-200" />

								<Text className="m-0 text-xs text-zinc-400">
									If you believe your account may be compromised, please reset
									your password and enable two-factor authentication.
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
