import * as React from "react";
import { useFieldContext } from "./form-context";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { FormFieldError } from "./field-error";
import { DatePicker, type DatePickerProps } from "../date-picker";

export type DatePickerFieldProps = {
  label?: string;
  description?: string;
  placeholder?: string;
} & Omit<DatePickerProps, "selected" | "onSelect">;

export const DatePickerField = React.forwardRef<
  HTMLButtonElement,
  DatePickerFieldProps
>(
  ({ label, description, placeholder }, _ref) => {
    const field = useFieldContext<Date | undefined>();
    const meta = field.state.meta;

    const isInvalid = meta.isTouched && meta.errors.length > 0;
    const errorId = isInvalid ? `${field.name}-error` : undefined;
    const descriptionId = description ? `${field.name}-description` : undefined;

    return (
      <Field data-invalid={isInvalid} className="space-y-1.5">
        {/* Label */}
        {label && (
          <FieldLabel htmlFor={field.name} className="text-sm">
            {label}
          </FieldLabel>
        )}

        <div aria-describedby={errorId ?? descriptionId}>
          <DatePicker
            selected={field.state.value}
            onSelect={(date) => field.handleChange(date)}
            placeholder={placeholder}
          />
        </div>

        <FormFieldError meta={meta} />

        {description && !isInvalid && (
          <FieldDescription id={descriptionId} className="text-xs">
            {description}
          </FieldDescription>
        )}
      </Field>
    );
  }
);

DatePickerField.displayName = "DatePickerField";
