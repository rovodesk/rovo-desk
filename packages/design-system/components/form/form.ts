<<<<<<< HEAD

=======
"use client";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

import { createFormHook } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { FormSubmitButton } from "./submit-button";
import { fieldContext, formContext } from "./form-context";
import { RadioGroupField } from "./radiogroup-field";
import { SelectField } from "./select-field";
import { CheckboxField } from "./checkbox-field";
import { TextareaField } from "./textarea-field";
import { DatePickerField } from "./date-picker-field";
import { SwitchField } from "./switch-field";
import { FileUploadField } from "./file-upload-field";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    SwitchField,
    CheckboxField,
    RadioGroupField,
    DatePickerField,
    FileUploadField
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
  fieldContext,
  formContext,
});
