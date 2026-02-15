import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../../lib/utils";

interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  withFade?: boolean;
  axis?: "vertical" | "horizontal" | "both"; // Added 'both' for flexibility
}

function ScrollArea({
  className,
  children,
  withFade = false,
  axis = "vertical",
  ...props
}: ScrollAreaProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [fades, setFades] = React.useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const checkScroll = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;

    // Only update states relevant to the active axis to save on renders
    setFades({
      top: (axis === "vertical" || axis === "both") && scrollTop > 0,
      bottom: (axis === "vertical" || axis === "both") && Math.ceil(scrollTop + clientHeight) < scrollHeight - 1,
      left: (axis === "horizontal" || axis === "both") && scrollLeft > 0,
      right: (axis === "horizontal" || axis === "both") && Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1,
    });
  }, [axis]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !withFade) return;

    checkScroll();

    const ro = new ResizeObserver(checkScroll);
    ro.observe(viewport);
    if (viewport.firstElementChild) ro.observe(viewport.firstElementChild);

    return () => ro.disconnect();
  }, [checkScroll, withFade, axis]);

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        onScroll={checkScroll}
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {/* We wrap children to ensure 'w-fit' logic if horizontal, 
            mirroring your original ScrollFade layout logic */}
        <div className={cn(
          axis === "horizontal" && "w-fit min-w-full",
          axis === "vertical" && "h-fit min-h-full",
          axis === "both" && "w-fit h-fit min-w-full min-h-full"
        )}>
          {children}
        </div>
      </ScrollAreaPrimitive.Viewport>

      {withFade && (
        <>
          {(axis === "vertical" || axis === "both") && (
            <>
              <FadeGradient side="top" visible={fades.top} />
              <FadeGradient side="bottom" visible={fades.bottom} />
            </>
          )}
          {(axis === "horizontal" || axis === "both") && (
            <>
              <FadeGradient side="left" visible={fades.left} />
              <FadeGradient side="right" visible={fades.right} />
            </>
          )}
        </>
      )}

      <ScrollBar orientation={axis === "both" ? "vertical" : axis} />
      {axis === "both" && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

// Helper component for the gradients to keep the main component clean
function FadeGradient({ side, visible }: { side: "top" | "bottom" | "left" | "right"; visible: boolean }) {
  const sideClasses = {
    top: "top-0 left-0 w-full h-10 bg-gradient-to-b",
    bottom: "bottom-0 left-0 w-full h-10 bg-gradient-to-t",
    left: "top-0 left-0 h-full w-10 bg-gradient-to-r",
    right: "top-0 right-0 h-full w-10 bg-gradient-to-l",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-20 transition-opacity duration-300 from-background to-transparent",
        sideClasses[side],
        visible ? "opacity-100" : "opacity-0"
      )}
    />
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent flex touch-none p-px transition-colors select-none z-30",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="rounded-full bg-border relative flex-1"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };