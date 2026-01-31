import { useFieldContext } from "./form-context"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { FormFieldError } from "./field-error"
import { Input } from "../ui/input"

type TextFieldProps = {
  label?: string
  description?: string
  icon?: React.ReactNode
  iconAlignment?: "inline-start" | "inline-end" | "block-start" | "block-end"
} & React.InputHTMLAttributes<HTMLInputElement>

export const TextField = ({
  label,
  description,
  icon,
  iconAlignment = "inline-start",
  ...props
}: TextFieldProps) => {
  const field = useFieldContext<string>()
  const meta = field.state.meta

  const isInvalid = meta.isTouched && meta.errors.length > 0

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      {icon ? (
        <InputGroup data-invalid={isInvalid} className="border rounded-md">
          <InputGroupInput
            id={field.name}
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
          spellCheck={false}
          {...props}
        />

          <InputGroupAddon align={iconAlignment}>
            {icon}
          </InputGroupAddon>
        </InputGroup>
      ): (
        <Input
          id={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
          spellCheck={false}
          {...props}
        />
      )}



      <FormFieldError meta={meta} />

      {description && !isInvalid && (
        <FieldDescription className="text-xs">{description}</FieldDescription>
      )}
    </Field>
  )
}