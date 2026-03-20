import { cn } from "@zero-heads-lab/design-system/lib/utils";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function PointerHighlight({
    children,
    rectangleClassName,
    pointerClassName,
    containerClassName,
}: {
    children: React.ReactNode;
    rectangleClassName?: string;
    pointerClassName?: string;
    containerClassName?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setDimensions({ width, height });
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div
            className={cn("relative w-fit", containerClassName)}
            ref={containerRef}
        >
            {children}
            {dimensions.width > 0 && dimensions.height > 0 && (
                <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="pointer-events-none absolute inset-0 z-0"
                    initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <motion.div
                        className={cn(
                            "absolute inset-0 border border-neutral-800 dark:border-neutral-200",
                            rectangleClassName
                        )}
                        initial={{
                            width: 0,
                            height: 0,
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                        }}
                        whileInView={{
                            width: dimensions.width,
                            height: dimensions.height,
                        }}
                    />
                    <motion.div
                        className="pointer-events-none absolute"
                        initial={{ opacity: 0 }}
                        style={{
                            rotate: -90,
                        }}
                        transition={{
                            opacity: { duration: 0.1, ease: "easeInOut" },
                            duration: 1,
                            ease: "easeInOut",
                        }}
                        whileInView={{
                            opacity: 1,
                            x: dimensions.width + 16,
                            y: dimensions.height + 16,
                        }}
                    >
                        <Pointer
                            className={cn("h-5 w-5 text-blue-500", pointerClassName)}
                        />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

const Pointer = ({ ...props }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            fill="currentColor"
            height="1em"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            viewBox="0 0 16 16"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M1     4.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
        </svg>
    );
};
