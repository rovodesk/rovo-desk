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
};

export const RadioGroupField = ({
  label,
  description,
  options,
  renderOption,
  className,
}: RadioGroupFieldProps) => {
  const field = useFieldContext<string>();
  const meta = field.state.meta;

  const isInvalid = meta.isTouched && meta.errors.length > 0;
  const errorId = isInvalid ? `${field.name}-error` : undefined;
  const descriptionId = description ? `${field.name}-description` : undefined;

  return (
    <Field data-invalid={isInvalid} className="space-y-2">
      {label && (
        <FieldLabel
          className={isInvalid ? "text-destructive" : undefined}
        >
          {label}
        </FieldLabel>
      )}

      {description && !isInvalid && (
        <FieldDescription id={descriptionId}>
          {description}
        </FieldDescription>
      )}

      <RadioGroup
        value={field.state.value}
        onValueChange={field.handleChange}
        aria-invalid={isInvalid}
        aria-describedby={errorId ?? descriptionId}
        className={className}
      >
        {options.map((option) => (
          <Field key={option.value} className="flex items-center flex-col">
            {renderOption ? (
              renderOption(option)
            ) : (
              <FieldLabel className="flex items-center gap-2 font-normal">
                <RadioGroupItem
                  value={option.value}
                  disabled={option.disabled}
                />
                <span className={option.disabled ? "text-muted-foreground" : undefined}>
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
