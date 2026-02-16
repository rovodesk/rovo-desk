import { AnyFieldMeta } from "@tanstack/react-form"
import { FieldError as UiFieldError } from "../ui/field"

type FormFieldErrorProps = {
  meta: AnyFieldMeta
}

export const FormFieldError = ({ meta }: FormFieldErrorProps) => {
  if (!meta.isTouched || !meta.errors?.length) return null

  return (
    <>
      {meta.errors.map((error: any, index: number) => {
        const message = typeof error === "string" ? error : error?.message;

        if (!message) return null;

        return (
          <UiFieldError key={index} errors={[{ message: message }]} />
        );
      })}
    </>
  );
};