import * as React from "react";
import { useFieldContext } from "./form-context";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { FormFieldError } from "./field-error";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export type RadioOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type RadioGroupFieldProps = {
  label?: string;
  description?: string;
  options: RadioOption[];
  renderOption?: (option: RadioOption) => React.ReactNode;
  className?: string;
  defaultValue?: string;
  /** Added: Callback for when the value changes, useful for immediate UI side-effects */
  onValueChange?: (value: string) => void;
};

export const RadioGroupField = ({
  label,
  description,
  options,
  renderOption,
  className,
  defaultValue,
  onValueChange, // Destructure the new prop
}: RadioGroupFieldProps) => {
  const field = useFieldContext<string>();
  const meta = field.state.meta;

  const isInvalid = meta.isTouched && meta.errors.length > 0;
  const errorId = isInvalid ? `${field.name}-error` : undefined;
  const descriptionId = description ? `${field.name}-description` : undefined;

  // Handle value change by notifying both the form context and the optional prop
  const handleValueChange = (value: string) => {
    field.handleChange(value);
    onValueChange?.(value);
  };

  return (
    <Field data-invalid={isInvalid} className="space-y-2">
      {label && (
        <FieldLabel className={isInvalid ? "text-destructive" : undefined}>
          {label}
        </FieldLabel>
      )}

      {description && !isInvalid && (
        <FieldDescription id={descriptionId}>
          {description}
        </FieldDescription>
      )}

      <RadioGroup
        value={field.state.value ?? defaultValue}
        onValueChange={handleValueChange} // Use the local handler
        aria-invalid={isInvalid}
        aria-describedby={errorId ?? descriptionId}
        className={className}
      >
        {options.map((option) => (
          <Field key={option.value} className="flex items-center">
            {renderOption ? (
              renderOption(option)
            ) : (
              <FieldLabel className="flex items-center gap-2 font-normal cursor-pointer">
                <RadioGroupItem
                  value={option.value}
                  disabled={option.disabled}
                />
                <span
                  className={
                    option.disabled ? "text-muted-foreground" : undefined
                  }
                >
                  {option.label}
                </span>
              </FieldLabel>
            )}
          </Field>
        ))}
      </RadioGroup>

      <FormFieldError meta={meta} />
    </Field>
  );
};

RadioGroupField.displayName = "RadioGroupField";