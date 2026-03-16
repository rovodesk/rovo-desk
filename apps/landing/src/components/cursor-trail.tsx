import { motion, useMotionValue, useSpring } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";

export function CursorTrail({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
}) {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth the "Lead" cursor
    const springConfig = { damping: 25, stiffness: 250 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>(
        []
    );

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const localX = e.clientX - rect.left;
            const localY = e.clientY - rect.top;

            mouseX.set(localX);
            mouseY.set(localY);

            // Create a trail point
            const newPoint = { x: localX, y: localY, id: Date.now() };
            setTrail((prev) => [...prev.slice(-6), newPoint]); // Keep last 6 points
        };

        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [containerRef, mouseX, mouseY]);

    return (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
            {/* The Trail Points */}
            {trail.map((point) => (
                <motion.div
                    animate={{ opacity: 0, scale: 0 }}
                    className="absolute h-2 w-2 rounded-full bg-blue-500/20"
                    initial={{ opacity: 0.5, scale: 1 }}
                    key={point.id}
                    style={{
                        left: point.x,
                        top: point.y,
                        x: "-50%",
                        y: "-50%",
                    }}
                    transition={{ duration: 0.5 }}
                />
            ))}

            {/* The Main "Enterprise" Cursor */}
            <motion.div className="absolute flex items-center gap-2" style={{ x, y }}>
                {/* Classic Mouse Arrow SVG */}
                <svg
                    className="text-blue-600 drop-shadow-lg"
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <path
                        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                </svg>

                {/* User Label Tag */}
                <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-blue-600 px-2 py-1 font-bold text-[10px] text-white shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                >
                    AI Agent
                </motion.div>
            </motion.div>
        </div>
    );
}
