<<<<<<< HEAD
<<<<<<< HEAD

=======
"use client"
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
=======
"use client"
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

import { useTheme } from "../../context/theme";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";
import { SquareCheck, Loader2, AlertTriangle, InfoIcon, OctagonAlert } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			className="toaster group"
			icons={{
				success: <SquareCheck className="size-4 bg-success" />,
				info: <InfoIcon className="size-4 bg-info" />,
				warning: <AlertTriangle className="size-4 bg-warning" />,
				error: <OctagonAlert className="size-4 bg-error" />,
				loading: <Loader2 className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			theme={theme as ToasterProps["theme"]}
			{...props}
		/>
	);
};

export { Toaster, toast };
