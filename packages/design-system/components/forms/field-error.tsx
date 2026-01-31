import { AnyFieldMeta } from "@tanstack/react-form"
import { ZodError } from "zod"
import { FieldError as UiFieldError } from "../ui/field"

type FormFieldErrorProps = {
  meta: AnyFieldMeta
}

export const FormFieldError = ({ meta }: FormFieldErrorProps) => {
  if (!meta.isTouched || !meta.errors?.length) return null

  return (
    <>
      {meta.errors.map((error: ZodError, index: number) => (
        <UiFieldError key={index} errors={[{ message: error.message }]} />
      ))}
    </>
  )
}