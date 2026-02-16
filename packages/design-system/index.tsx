import { ModalHost } from "./components/modal-host";
import { Toaster } from "./components/ui/toast";
import { TooltipProvider } from "./components/ui/tooltip";
import { FontProvider } from "./context/font";
import { ModalProvider } from "./context/modal";
import { ThemeProvider, ThemeProviderProps } from "./context/theme";

export const UIProvider = ({
	children,
	...properties
}: ThemeProviderProps) => (
	<ThemeProvider {...properties}>
		<ModalProvider>
		<FontProvider>
			<TooltipProvider>
				{children}
				<Toaster />
				<ModalHost />
			</TooltipProvider>
		</FontProvider>
		</ModalProvider>
	</ThemeProvider>
);
	