import { useFieldContext } from "./form-context"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { FormFieldError } from "./field-error"

type SelectOption = {
  label?: string
  value: string
}

type SelectFieldProps = {
  label?: string
  description?: string
  placeholder?: string
  options: SelectOption[]
  defaultValue?: string
}

export const SelectField = ({
  label,
  description,
  placeholder = "Select an option",
  options,
  defaultValue,
}: SelectFieldProps) => {
  const field = useFieldContext<string>()
  const meta = field.state.meta

  const isInvalid = meta.isTouched && meta.errors.length > 0

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Select
        value={field.state.value ?? ""}
        onValueChange={(value) => field.handleChange(value)}
        onOpenChange={() => field.handleBlur()}
        defaultValue={defaultValue}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
            <SelectGroup>
                <SelectLabel>{label || field.name}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <FormFieldError meta={meta} />

      {description && !isInvalid && (
        <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  )
}