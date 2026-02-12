import * as React from "react";
import { useFieldContext } from "./form-context";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { FormFieldError } from "./field-error";
import { Tag, TagInput, TagInputProps } from 'emblor';

export type TagInputFieldProps = {
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
} & TagInputProps;

export const TagInputField = React.forwardRef<
  HTMLInputElement,
  TagInputFieldProps
>(({ label, description, placeholder, className, ...props }, ref) => {
  const field = useFieldContext<Tag[]>();
  const meta = field.state.meta;

  // 1. Add state for the active index (emblor requires this to be managed)
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

  const isInvalid = meta.isTouched && meta.errors.length > 0;
  const errorId = isInvalid ? `${field.name}-error` : undefined;
  const descriptionId = description ? `${field.name}-description` : undefined;

  // 2. Ensure tags is ALWAYS an array, even if the form state is null/undefined
  const tagsValue = Array.isArray(field.state.value) ? field.state.value : [];

  return (
    <Field data-invalid={isInvalid} className="space-y-1.5">
      {label && (
        <FieldLabel htmlFor={field.name} className="text-sm">
          {label}
        </FieldLabel>
      )}

      <TagInput
        ref={ref}
        id={field.name}
        tags={tagsValue}
        placeholder={placeholder}
        className={className}
        onBlur={field.handleBlur}
        setTags={(newTags) => {
          field.handleChange(newTags as Tag[]);
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        aria-invalid={isInvalid || undefined}
        aria-describedby={errorId ?? descriptionId}
        {...props}
      />

      <FormFieldError meta={meta} />

      {description && !isInvalid && (
        <FieldDescription id={descriptionId} className="text-xs">
          {description}
        </FieldDescription>
      )}
    </Field>
  );
});

TagInputField.displayName = "TagInputField";
