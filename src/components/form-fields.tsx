import { Input } from "@/components/ui/input";
import { useId } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";

interface FormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: { message?: string | undefined };
  invalid?: boolean;
  containerClassName?: string;
}

export function FormInputField({
  label,
  error,
  invalid = !!error,
  description,
  containerClassName,
  ...field
}: React.ComponentProps<typeof Input> & FormFieldProps) {
  const _id = useId();
  const id = `${_id}-${field.name || "input"}`;

  return (
    <Field data-invalid={invalid} className={containerClassName}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input {...field} id={id} aria-invalid={invalid} />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  );
}

export function FormTextareaField({
  label,
  error,
  invalid = !!error,
  containerClassName,
  ...field
}: React.ComponentProps<typeof Textarea> & FormFieldProps) {
  const _id = useId();
  const id = `${_id}-${field.name || "input"}`;
  return (
    <Field data-invalid={invalid} className={containerClassName}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea {...field} id={id} aria-invalid={invalid} />
      {field.description ? (
        <FieldDescription>{field.description}</FieldDescription>
      ) : null}
      {invalid ? <FieldError errors={[error]} /> : null}
    </Field>
  );
}
