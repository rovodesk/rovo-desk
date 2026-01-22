import { Toaster } from "./components/ui/toast";
import { TooltipProvider } from "./components/ui/tooltip";
import { FontProvider } from "./context/font";
import { ThemeProvider, ThemeProviderProps } from "./context/theme";

export const UIProvider = ({
	children,
	...properties
}: ThemeProviderProps) => (
	<ThemeProvider {...properties}>
		<FontProvider>
			<TooltipProvider>{children}</TooltipProvider>
			<Toaster />
		</FontProvider>
	</ThemeProvider>
);
	