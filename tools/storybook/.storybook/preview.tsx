import type { Preview } from "@storybook/react-vite";
import { UIProvider } from "@zero-heads-lab/design-system";
import "@zero-heads-lab/design-system/styles/default.css";
import { withThemeByClassName } from "@storybook/addon-themes";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		chromatic: {
			modes: {
				light: {
					theme: "light",
					className: "light",
				},
				dark: {
					theme: "dark",
					className: "dark",
				},
			},
		},
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
	},
	decorators: [
		withThemeByClassName({
			themes: {
				light: "light",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
		// biome-ignore lint/suspicious/noExplicitAny: Story is of any type
		(Story: any) => (
			<div className="bg-background">
				<UIProvider>
					<Story />
				</UIProvider>
			</div>
		),
	],
};

export default preview;
