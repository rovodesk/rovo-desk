import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const switchVariants = cva(
  "group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-8 w-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-none data-[state=checked]:ml-auto data-[state=unchecked]:ml-0",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-7",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(switchVariants({ size }), className)}
    {...props}
  >
    <SwitchPrimitive.Thumb asChild>
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={cn(thumbVariants({ size }))}
      />
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
))

Switch.displayName = "Switch"

export { Switch }