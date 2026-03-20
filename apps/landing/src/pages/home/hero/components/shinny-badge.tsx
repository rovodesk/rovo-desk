import { cn } from "@zero-heads-lab/design-system/lib/utils";
import type { ComponentPropsWithoutRef, CSSProperties, FC } from "react";

export interface ShinnyTextProps extends ComponentPropsWithoutRef<"span"> {
    shimmerWidth?: number;
}

export const ShinnyBadge = () => {
    return (
        <div className="z-10 flex min-h-24 items-center justify-center">
            <div
                className={cn(
                    "group rounded-full border-2 border-black/5 bg-transparent text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:hover:bg-neutral-800"
                )}
            >
                <ShinnyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>✨ Coming Soon</span>
                </ShinnyText>
            </div>
        </div>
    );
};

export const ShinnyText: FC<ShinnyTextProps> = ({
    children,
    className,
    shimmerWidth = 100,
    ...props
}) => {
    return (
        <span
            className={cn(
                "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",

                // Shine effect
                "animate-shiny-text bg-position-[0_0] bg-size-[var(--shiny-width)_100%] bg-clip-text bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

                // Shine gradient
                "bg-linear-to-r from-transparent via-50% via-black/80 to-transparent dark:via-white/80",

                className
            )}
            style={
                {
                    "--shiny-width": `${shimmerWidth}px`,
                } as CSSProperties
            }
            {...props}
        >
            {children}
        </span>
    );
};
