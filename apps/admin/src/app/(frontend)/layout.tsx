import type React from "react";
import "@zero-heads-lab/design-system/styles/default.css";
import { UIProvider } from "@zero-heads-lab/design-system";

export const metadata = {
	description: "A blank template using Payload in a Next.js app.",
	title: "Payload Blank Template",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props;

	return (
		<html lang="en">
			<body>
				<UIProvider>
					<main>{children}</main>
				</UIProvider>
			</body>
		</html>
	);
}
