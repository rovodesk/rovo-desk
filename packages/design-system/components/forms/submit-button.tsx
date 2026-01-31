import { Button } from "../ui/button"
import * as React from "react"
import { useFormContext } from "./form-context"
import { Loader2 } from "lucide-react"

type FormSubmitButtonProps = {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
} & React.ComponentProps<typeof Button>

export const FormSubmitButton = React.forwardRef<
  HTMLButtonElement,
  FormSubmitButtonProps
>(
  (
    {
      loading = false,
      loadingText,
      children,
      disabled,
      className,
      type = "submit",
      onClick,
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
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (type === "submit" && form) {
            e.preventDefault()
            form.handleSubmit()
          }
          onClick?.(e)
        }}
        {...props}
      >
        {loading || isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{loadingText ?? "Loading…"}</span>
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)

FormSubmitButton.displayName = "FormSubmitButton"