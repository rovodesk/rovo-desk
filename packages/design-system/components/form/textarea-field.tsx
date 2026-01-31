import * as React from "react";
import { useFieldContext } from "./form-context";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { FormFieldError } from "./field-error";
import { Textarea } from "../ui/textarea";

export type TextareaFieldProps = {
  label?: string;
  description?: string;
  rows?: number;
  maxLength?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      description,
      rows = 4,
      maxLength,
      ...props
    },
    ref
  ) => {
    const field = useFieldContext<string>();
    const meta = field.state.meta;

    const isInvalid = meta.isTouched && meta.errors.length > 0;
    const errorId = isInvalid ? `${field.name}-error` : undefined;
    const descriptionId = description ? `${field.name}-description` : undefined;

    const value = field.state.value ?? "";
    const remaining = maxLength ? maxLength - value.length : undefined;

    return (
      <Field data-invalid={isInvalid} className="space-y-1.5">
        {/* Label */}
        {label && (
          <FieldLabel htmlFor={field.name} className="text-sm">
            {label}
          </FieldLabel>
        )}

        {/* Textarea */}
        <Textarea
          id={field.name}
          ref={ref}
          rows={rows}
          value={value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid || undefined}
          aria-describedby={errorId ?? descriptionId}
          spellCheck={false}
          maxLength={maxLength}
          {...props}
        />

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <FormFieldError meta={meta} />

            {description && !isInvalid && (
              <FieldDescription id={descriptionId} className="text-xs">
                {description}
              </FieldDescription>
            )}
          </div>

          {typeof remaining === "number" && (
            <span
              className={
                remaining < 0
                  ? "text-xs text-destructive"
                  : "text-xs text-muted-foreground"
              }
            >
              {remaining}
            </span>
          )}
        </div>
      </Field>
    );
  }
);

TextareaField.displayName = "TextareaField";
