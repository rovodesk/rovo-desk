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
import React from "react"
import { cn } from "../../lib/utils"

type SelectOption<T = string | number> = {
  label?: string
  value: T
}

type SelectFieldProps<T = string | number> = {
  label?: string
  description?: string
  placeholder?: string
  icon?: React.ReactNode
  options: SelectOption<T>[]
  disabled?: boolean
  defaultValue?: T
}

export const SelectField = <T extends string | number>({
  label,
  description,
  placeholder = "Select an option",
  options,
  disabled = false,
  defaultValue,
  icon,
}: SelectFieldProps<T>) => {
  const field = useFieldContext<T>()
  const meta = field.state.meta
  const isInvalid = meta.isTouched && meta.errors.length > 0

  const currentValue = field.state.value ?? defaultValue

  return (
    <Field data-invalid={isInvalid} className="w-full">
      {label && (
        <FieldLabel
          className="mb-1.5 inline-block text-sm font-medium"
          htmlFor={field.name}
        >
          {label}
        </FieldLabel>
      )}

      <Select
        value={currentValue !== undefined ? String(currentValue) : ""}
        onValueChange={(value) => {
          const option = options.find(
            (o) => String(o.value) === value
          )
          if (option) {
            field.handleChange(option.value)
          }
        }}
        onOpenChange={() => field.handleBlur()}
        disabled={disabled}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className="relative flex h-10 w-full items-center gap-3 px-3 py-2 text-sm transition-all focus:ring-2 focus:ring-primary/20"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="max-h-64 overflow-y-auto">
          <SelectGroup>
            {label && (
              <SelectLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {label}
              </SelectLabel>
            )}

            {options.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                className="group cursor-pointer transition-colors focus:bg-accent"
              >
                <div className="flex items-center gap-2.5">
                  {React.isValidElement(icon) && (
                    <span className="shrink-0 opacity-40 grayscale transition-all group-focus:opacity-100 group-focus:grayscale-0">
                      {React.cloneElement(icon as React.ReactElement<any>, {
                        className: cn(
                          "size-4",
                          (icon.props as any).className
                        ),
                      })}
                    </span>
                  )}
                  <span className="truncate">
                    {option.label ?? option.value}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <FormFieldError meta={meta} />

      {description && !isInvalid && (
        <FieldDescription className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground/80">
          {description}
        </FieldDescription>
      )}
    </Field>
  )
}