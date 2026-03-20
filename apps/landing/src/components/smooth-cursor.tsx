import { motion, useSpring } from "motion/react";
import { type FC, useEffect, useRef, useState } from "react";

interface Position {
    x: number;
    y: number;
}

export interface SmoothCursorProps {
    cursor?: React.ReactNode;
    springConfig?: {
        damping: number;
        stiffness: number;
        mass: number;
        restDelta: number;
    };
}

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

function isTrackablePointer(pointerType: string) {
    return pointerType !== "touch";
}

const DefaultCursorSVG: FC = () => {
    return (
        <svg
            fill="none"
            height={54}
            style={{ scale: 0.5 }}
            viewBox="0 0 50 54"
            width={50}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_d_91_7928)">
                <path
                    d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
                    fill="white"
                />
                <path
                    d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
                    stroke="black"
                    strokeWidth={2.258_25}
                />
            </g>
            <defs>
                <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height={52.428}
                    id="filter0_d_91_7928"
                    width={49.0584}
                    x={0.602_397}
                    y={0.952_444}
                >
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        result="hardAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy={2.258_25} />
                    <feGaussianBlur stdDeviation={2.258_25} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                    />
                    <feBlend
                        in2="BackgroundImageFix"
                        mode="normal"
                        result="effect1_dropShadow_91_7928"
                    />
                    <feBlend
                        in="SourceGraphic"
                        in2="effect1_dropShadow_91_7928"
                        mode="normal"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    );
};

export function SmoothCursor({
    cursor = <DefaultCursorSVG />,
    springConfig = {
        damping: 45,
        stiffness: 400,
        mass: 1,
        restDelta: 0.001,
    },
}: SmoothCursorProps) {
    const lastMousePos = useRef<Position>({ x: 0, y: 0 });
    const velocity = useRef<Position>({ x: 0, y: 0 });
    const lastUpdateTime = useRef(Date.now());
    const previousAngle = useRef(0);
    const accumulatedRotation = useRef(0);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cursorType, setCursorType] = useState<"default" | "pointer">("default");
    const [isTextFocused, setIsTextFocused] = useState(false);

    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const rotation = useSpring(0, {
        ...springConfig,
        damping: 60,
        stiffness: 300,
    });
    const scale = useSpring(1, {
        ...springConfig,
        stiffness: 500,
        damping: 35,
    });

    // Enable on Desktop only
    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);

        const updateEnabled = () => {
            const nextIsEnabled = mediaQuery.matches;
            setIsEnabled(nextIsEnabled);

            if (!nextIsEnabled) {
                setIsVisible(false);
            }
        };

        updateEnabled();
        mediaQuery.addEventListener("change", updateEnabled);

        return () => {
            mediaQuery.removeEventListener("change", updateEnabled);
        };
    }, []);

    // Detect focus (ONLY thing that hides cursor)
    useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            const el = e.target as HTMLElement;
            const tag = el.tagName.toLowerCase();

            if (
                tag === "input" ||
                tag === "textarea" ||
                el.isContentEditable
            ) {
                setIsTextFocused(true);
            }
        };

        const handleFocusOut = () => setIsTextFocused(false);

        window.addEventListener("focusin", handleFocusIn);
        window.addEventListener("focusout", handleFocusOut);

        return () => {
            window.removeEventListener("focusin", handleFocusIn);
            window.removeEventListener("focusout", handleFocusOut);
        };
    }, []);

    // For Input
    useEffect(() => {
        if (!isEnabled) return;

        const shouldShowNative =
            isTextFocused && cursorType !== "pointer";

        document.body.style.cursor = shouldShowNative ? "auto" : "none";

        return () => {
            document.body.style.cursor = "auto";
        };
    }, [isEnabled, isTextFocused, cursorType]);

    // Pointer tracking
    useEffect(() => {
        if (!isEnabled) {
            return;
        }

        let timeout: ReturnType<typeof setTimeout> | null = null;

        const updateVelocity = (currentPos: Position) => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastUpdateTime.current;

            if (deltaTime > 0) {
                velocity.current = {
                    x: (currentPos.x - lastMousePos.current.x) / deltaTime,
                    y: (currentPos.y - lastMousePos.current.y) / deltaTime,
                };
            }

            lastUpdateTime.current = currentTime;
            lastMousePos.current = currentPos;
        };

        const smoothPointerMove = (e: PointerEvent) => {
            if (!isTrackablePointer(e.pointerType)) {
                return;
            }

            // Detect clickable elements
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (el) {
                const tag = el.tagName.toLowerCase();
                const computed = window.getComputedStyle(el).cursor;

                if (
                    computed === "pointer" ||
                    tag === "button" ||
                    tag === "a" ||
                    el.getAttribute("role") === "button"
                ) {
                    setCursorType("pointer");
                } else {
                    setCursorType("default");
                }
            }

            setIsVisible(true);

            const currentPos = { x: e.clientX, y: e.clientY };
            updateVelocity(currentPos);

            const speed = Math.sqrt(
                velocity.current.x ** 2 + velocity.current.y ** 2
            );

            cursorX.set(currentPos.x);
            cursorY.set(currentPos.y);

            if (speed > 0.1) {
                const currentAngle =
                    Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
                    90;

                let angleDiff = currentAngle - previousAngle.current;
                if (angleDiff > 180) angleDiff -= 360;
                if (angleDiff < -180) angleDiff += 360;
                accumulatedRotation.current += angleDiff;
                rotation.set(accumulatedRotation.current);
                previousAngle.current = currentAngle;

                scale.set(0.95);

                if (timeout !== null) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(() => {
                    scale.set(1);
                }, 150);
            }
        };

        let rafId = 0;
        const throttledPointerMove = (e: PointerEvent) => {
            if (!isTrackablePointer(e.pointerType)) {
                return;
            }

            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                smoothPointerMove(e);
                rafId = 0;
            });
        };

        window.addEventListener("pointermove", throttledPointerMove, {
            passive: true,
        });

        return () => {
            window.removeEventListener("pointermove", throttledPointerMove);
            document.body.style.cursor = "auto";
            if (rafId) cancelAnimationFrame(rafId);
            if (timeout !== null) {
                clearTimeout(timeout);
            }
        };
    }, [cursorX, cursorY, rotation, scale, isEnabled]);

    if (!isEnabled) {
        return null;
    }

    return (
        <motion.div
            animate={{
                opacity:
                    isVisible &&
                        (
                            !isTextFocused || // normal case
                            (isTextFocused && cursorType === "pointer") // allow only for button
                        )
                        ? 1
                        : 0,
            }}
            initial={false}
            style={{
                position: "fixed",
                left: cursorX,
                top: cursorY,
                translateX: "-50%",
                translateY: "-50%",
                rotate: rotation,
                scale,
                zIndex: 100,
                pointerEvents: "none",
                willChange: "transform"
            }}
            transition={{
                duration: 0.15,
            }}
        >
            <motion.div
                animate={{
                    scale: cursorType === "pointer" ? 0.6 : 1,
                }}
            >
                {cursor}
            </motion.div>
        </motion.div>
    );
}
