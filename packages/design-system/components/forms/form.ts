import { createFormHook } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { FormSubmitButton } from "./submit-button";
import { fieldContext, formContext } from "./form-context";
import { RadioGroupField } from "./radiogroup-field";
import { SelectField } from "./select-field";
import { CheckboxField } from "./checkbox-field";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    CheckboxField,
    RadioGroupField
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
  fieldContext,
  formContext,
});
