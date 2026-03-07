import * as React from "react"
import { Button } from "../ui/button"
import { useFormContext } from "./form-context"
import { Loader2, RotateCcw } from "lucide-react"

type FormResetButtonProps = {
  label?: string
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  children?: React.ReactNode
} & Omit<React.ComponentProps<typeof Button>, "loading" | "children" | "type">

export const FormResetButton = React.forwardRef<
  HTMLButtonElement,
  FormResetButtonProps
>(
  (
    {
      loading,
      children,
      loadingText = "Resetting...",
      icon,
      label,
      ...props
    },
    ref
  ) => {
    const form = useFormContext()

    return (
      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
      >
        {({ isSubmitting, isDirty }) => (
          <Button
            ref={ref}
            type="button"
            variant="ghost"
            disabled={loading || isSubmitting || !isDirty}
            aria-busy={loading || isSubmitting}
            aria-disabled={loading || isSubmitting || !isDirty}
            onClick={() => form.reset()}
            {...props}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {loadingText}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {icon ?? <RotateCcw className="h-4 w-4" />}
                {label || children || "Reset"}
              </span>
            )}
          </Button>
        )}
      </form.Subscribe>
    )
  }
)

FormResetButton.displayName = "FormResetButton"