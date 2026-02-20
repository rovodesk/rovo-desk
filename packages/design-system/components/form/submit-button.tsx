import * as React from "react"
import { Button } from "../ui/button"
import { useFormContext } from "./form-context"
import { Loader2 } from "lucide-react"

type FormSubmitButtonProps = {
  label?: string;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Button>, "loading" | "children" | "type" >

export const FormSubmitButton = React.forwardRef<
  HTMLButtonElement,
  FormSubmitButtonProps
>(
  (
    {
      loading,
      children,
      loadingText = "Submitting...",
      icon,
      label,
      ...props
    },
    ref
  ) => {
    const form = useFormContext()

    return (
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
        <Button
          ref={ref}
          type="submit"
          disabled={loading || isSubmitting}
          aria-busy={loading || isSubmitting}
          aria-disabled={loading || isSubmitting}
          {...props}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText ?? "Submitting…"}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {icon}
              {label || children}
            </span>
          )}
      </Button>
      )}
      </form.Subscribe>
    )
  }
)

FormSubmitButton.displayName = "FormSubmitButton"
