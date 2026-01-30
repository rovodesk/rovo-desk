import { useFieldContext } from "./form-context"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { Checkbox } from "../ui/checkbox"
import { FormFieldError } from "./field-error"

type CheckboxFieldProps = {
  label?: string
  description?: string
}

export const CheckboxField = ({ label, description, ...props }: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>()
  const meta = field.state.meta

  const isInvalid = meta.isTouched && meta.errors.length > 0

  return (
    <Field data-invalid={isInvalid}>
      <div className="flex items-start gap-2">
        <Checkbox
          id={field.name}
          checked={!!field.state.value}
          onCheckedChange={(checked) => {
            field.handleChange(!!checked)
          }}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
          {...props}
        />

        <div className="grid gap-1">
          {label && (
            <FieldLabel
              htmlFor={field.name}
              className={isInvalid ? "text-destructive" : undefined}
            >
              {label}
            </FieldLabel>
          )}

          {description && (
            <FieldDescription
              className={isInvalid ? "text-destructive/80" : undefined}
            >
              {description}
            </FieldDescription>
          )}
        </div>
      </div>

      <FormFieldError meta={meta} />
    </Field>
  )
}