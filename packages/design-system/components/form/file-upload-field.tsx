"use client";

import { useFieldContext } from "./form-context"
import { Field, FieldDescription, FieldLabel } from "../ui/field"
import { FormFieldError } from "./field-error"
import { Input } from "../ui/input"

type FileUploadFieldProps = {
  label?: string
  description?: string
  accept?: string
  multiple?: boolean
}

export const FileUploadField = ({
  label,
  description,
  accept,
  multiple = false,
  ...props
}: FileUploadFieldProps) => {
  const field = useFieldContext<File | File[] | null>()
  const meta = field.state.meta

  const isInvalid = meta.isTouched && meta.errors.length > 0

  const value = field.state.value

  return (
    <Field data-invalid={isInvalid}>
      <div className="grid gap-2">
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

        <Input
          id={field.name}
          name={field.name}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
          className="block w-full rounded border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
          onChange={(e) => {
            const files = e.target.files

            if (!files) {
              field.handleChange(null)
              return
            }

            if (multiple) {
              field.handleChange(Array.from(files))
            } else {
              field.handleChange(files[0] ?? null)
            }
          }}
          onBlur={field.handleBlur}
          {...props}
        />

        {/* Selected file(s) preview */}
        {value && !Array.isArray(value) && (
          <div className="text-sm text-muted-foreground">
            Selected: {value.name}
          </div>
        )}

        {Array.isArray(value) && value.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {value.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <FormFieldError meta={meta} />
    </Field>
  )
}