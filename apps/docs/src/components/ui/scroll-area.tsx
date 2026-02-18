import * as Primitive from "@radix-ui/react-scroll-area";
import * as React from "react";
import { cn } from "../../lib/cn";

const ScrollArea = React.forwardRef<
	React.ComponentRef<typeof Primitive.Root>,
	React.ComponentPropsWithoutRef<typeof Primitive.Root>
>(({ className, children, ...props }, ref) => (
	<Primitive.Root
		className={cn("overflow-hidden", className)}
		ref={ref}
		type="scroll"
		{...props}
	>
		{children}
		<Primitive.Corner />
		<ScrollBar orientation="vertical" />
	</Primitive.Root>
));

ScrollArea.displayName = Primitive.Root.displayName;

const ScrollViewport = React.forwardRef<
	React.ComponentRef<typeof Primitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof Primitive.Viewport>
>(({ className, children, ...props }, ref) => (
	<Primitive.Viewport
		className={cn("size-full rounded-[inherit]", className)}
		ref={ref}
		{...props}
	>
		{children}
	</Primitive.Viewport>
));

ScrollViewport.displayName = Primitive.Viewport.displayName;

const ScrollBar = React.forwardRef<
	React.ComponentRef<typeof Primitive.Scrollbar>,
	React.ComponentPropsWithoutRef<typeof Primitive.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
	<Primitive.Scrollbar
		className={cn(
			"flex select-none data-[state=hidden]:animate-fd-fade-out",
			orientation === "vertical" && "h-full w-1.5",
			orientation === "horizontal" && "h-1.5 flex-col",
			className
		)}
		orientation={orientation}
		ref={ref}
		{...props}
	>
		<Primitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-fd-border" />
	</Primitive.Scrollbar>
));
ScrollBar.displayName = Primitive.Scrollbar.displayName;

export { ScrollArea, ScrollBar, ScrollViewport };
export type ScrollAreaProps = Primitive.ScrollAreaProps;
