import { useTheme } from "../context/theme";
import { cn } from "../lib/utils";
import type * as React from "react";
import { useMemo } from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
    background?: boolean;
    backgroundGraidentStart?: string;
    backgroundGraidentEnd?: string;
};

export function Logo({
    className,
    background,
    backgroundGraidentStart = "#00bcff",
    backgroundGraidentEnd = "#5A3BFF",
    title = "RovoDesk",
    ...props
}: LogoProps) {
    const { resolvedTheme } = useTheme()

    const strokeColor =
        resolvedTheme === "dark" ? "#FFFFFF" : "#000000"

    return (
        <svg
            viewBox="0 0 64 64"
            className={cn("h-10 w-10", className)}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={title}
            {...props}
        >
            {title && <title>{title}</title>}

            {background && (
                <defs>
                    <linearGradient id="rovoGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={backgroundGraidentStart} />
                        <stop offset="100%" stopColor={backgroundGraidentEnd} />
                    </linearGradient>
                </defs>
            )}

            {/* Background */}
            <rect
                x="4"
                y="4"
                width="60"
                height="60"
                rx="14"
                fill="url(#rovoGradient)"
            />

            {/* Modern R */}
            <path
                d="M22 18H36
           C42 18 46 21 46 26
           C46 31 42 34 36 34
           H22
           M36 34L46 46"
                stroke={strokeColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}

export default Logo;