import * as React from "react"
import { Button } from "../ui/button"
import { useFormContext } from "./form-context"
import { Loader2 } from "lucide-react"

type FormSubmitButtonProps = {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  children: React.ReactNode
} & React.ComponentProps<typeof Button>

export const FormSubmitButton = React.forwardRef<
  HTMLButtonElement,
  FormSubmitButtonProps
>(
  (
    {
      loading = false,
      loadingText,
      icon,
      children,
      disabled,
      type = "submit",
      ...props
    },
    ref
  ) => {
    const form = useFormContext()
    const isSubmitting = form?.state?.isSubmitting ?? false
    const isDisabled = disabled || loading || isSubmitting

    return (
      <Button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || isSubmitting}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading || isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText ?? "Submitting…"}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {icon}
            {children}
          </span>
        )}
      </Button>
    )
  }
)

FormSubmitButton.displayName = "FormSubmitButton"
