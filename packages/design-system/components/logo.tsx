import { cn } from "../lib/utils";
import type * as React from "react";

type LogoProps = React.SVGProps<SVGSVGElement> & {
    title?: string;
};

export function LogoIcon({
    className,
    title = "Zero Heads Icon",
    ...props
}: LogoProps) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden={title ? undefined : true}
            role={title ? "img" : "presentation"}
            className={cn("fill-current shrink-0", className)}
            {...props}
        >
            {title && <title>{title}</title>}
            {/* A stylized geometric triangle icon */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 4L30 28H2L16 4ZM16 9.5L7.5 24H24.5L16 9.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function Logo({
    className,
    title = "Zero Heads",
    ...props
}: LogoProps) {

    return (
        <svg
            viewBox="0 0 235 203"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden={title ? undefined : true}
            role={title ? "img" : "presentation"}
            className={cn("fill-current shrink-0", className)}
            {...props}
        >
            {title && <title>{title}</title>}
            <path
                d="M117.082 0L234.164 202.794H0L117.082 0Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default Logo;