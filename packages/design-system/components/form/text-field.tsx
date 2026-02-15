import * as React from "react";
import { useFieldContext } from "./form-context";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { FormFieldError } from "./field-error";
import { Input } from "../ui/input";

export type TextFieldProps = {
  label?: string;
  description?: string;
  extraMessage?: string;
  icon?: React.ReactNode;
  iconAlignment?: "inline-start" | "inline-end" | "block-start" | "block-end";
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      description,
      extraMessage,
      icon,
      iconAlignment = "inline-start",
      ...props
    },
    ref
  ) => {
    const field = useFieldContext<string>();
    const meta = field.state.meta;

    const isInvalid = meta.isTouched && meta.errors.length > 0;
    const errorId = isInvalid ? `${field.name}-error` : undefined;
    const descriptionId = description ? `${field.name}-description` : undefined;

    const sharedInputProps = {
      id: field.name,
      ref,
      value: field.state.value ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        field.handleChange(e.target.value),
      onBlur: field.handleBlur,
      "aria-invalid": isInvalid || undefined,
      "aria-describedby": errorId ?? descriptionId,
      spellCheck: false,
      ...props,
    };

    return (
      <Field data-invalid={isInvalid} className="space-y-1.5">
        {label && (
          <FieldLabel htmlFor={field.name} className="text-sm">
            {label}
          </FieldLabel>
        )}

        {icon ? (
          <InputGroup
            data-invalid={isInvalid}
          >
            <InputGroupInput {...sharedInputProps} />
            <InputGroupAddon
              align={iconAlignment}
            >
              {icon}
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <Input
            {...sharedInputProps}
          />
        )}

        <FormFieldError meta={meta} />

        {extraMessage && (
          <FieldDescription className="text-xs">
            {extraMessage}
          </FieldDescription>
        )}

        {description && !isInvalid && (
          <FieldDescription id={descriptionId} className="text-xs">
            {description}
          </FieldDescription>
        )}
      </Field>
    );
  }
);

TextField.displayName = "TextField";
