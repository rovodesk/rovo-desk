import * as React from "react";
import { useFieldContext } from "./form-context";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { FormFieldError } from "./field-error";
import { Switch } from "../ui/switch";

export type SwitchFieldProps = {
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const SwitchField: React.ForwardRefExoticComponent<
  SwitchFieldProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef(({ label, description, ...props }, ref) => {
  const field = useFieldContext<boolean>();
  const meta = field.state.meta;

  const isInvalid = meta.isTouched && meta.errors.length > 0;
  const errorId = isInvalid ? `${field.name}-error` : undefined;
  const descriptionId = description ? `${field.name}-description` : undefined;

  return (
    <Field data-invalid={isInvalid} className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        {label && (
          <FieldLabel htmlFor={field.name} className="text-sm">
            {label}
          </FieldLabel>
        )}

        <Switch
          id={field.name}
          ref={ref}
          checked={Boolean(field.state.value)}
          onCheckedChange={(value) => field.handleChange(value)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid || undefined}
          aria-describedby={errorId ?? descriptionId}
          {...props}
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
});

SwitchField.displayName = "SwitchField";
