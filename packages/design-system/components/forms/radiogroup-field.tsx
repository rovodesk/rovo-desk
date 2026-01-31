import { useFieldContext } from "./form-context"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { FormFieldError } from "./field-error"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

type RadioOption = {
  label: string
  value: string
  disabled?: boolean
}

type RadioGroupFieldProps = {
  label?: string
  description?: string
  options: RadioOption[]
  orientation?: "vertical" | "horizontal"
}

export const RadioGroupField = ({
  label,
  description,
  options,
  orientation = "vertical",
}: RadioGroupFieldProps) => {
  const field = useFieldContext<string>()
  const meta = field.state.meta

  const isInvalid = meta.isTouched && meta.errors.length > 0

  return (
    <Field data-invalid={isInvalid}>
      <div className="grid gap-2">
        {label && (
          <FieldLabel
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

        <div
          role="radiogroup"
          aria-invalid={isInvalid}
          className={
            orientation === "horizontal"
              ? "flex gap-4"
              : "grid gap-2"
          }
        >
          {options.map((option) => {
            const id = `${field.name}-${option.value}`

            return (
              <Label
                key={option.value}
                htmlFor={id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Input
                  id={id}
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={field.state.value === option.value}
                  disabled={option.disabled}
                  onChange={() => field.handleChange(option.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  className="h-4 w-4"
                />

                <span
                  className={
                    option.disabled
                      ? "text-muted-foreground"
                      : undefined
                  }
                >
                  {option.label}
                </span>
              </Label>
            )
          })}
        </div>
      </div>

      <FormFieldError meta={meta} />
    </Field>
  )
}