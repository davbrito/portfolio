import { FormInputField, FormTextareaField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { Turnstile } from "@marsidev/react-turnstile";
import { actions, isInputError } from "astro:actions";
import { CF_TURNSTILE_SITE_KEY } from "astro:env/client";
import { SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";

interface ContactFormProps {
  profileId: string;
}

export default function ContactForm({ profileId }: ContactFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = form;
  const error = errors.root?.message;
  return (
    <>
      <div className="space-y-3 text-center">
        <p className="text-primary font-mono font-semibold">05. ¿Qué sigue?</p>
        <h3 className="text-foreground text-3xl font-bold sm:text-4xl">Ponte en Contacto</h3>
        <p className="text-muted-foreground mx-auto max-w-prose text-pretty">
          Estoy abierto a nuevas oportunidades y colaboraciones. Ya sea que tengas una pregunta, una propuesta de
          proyecto o simplemente quieras saludar, me encantaría escucharte.
        </p>
      </div>
      <form
        className="space-y-4"
        id="contact-form"
        onSubmit={handleSubmit(async (data) => {
          const token = document.querySelector<HTMLInputElement>(
            '#contact-form input[name="cf-turnstile-response"]',
          )?.value;

          const result = await actions.contactForm({ ...data, profileId, cfTurnstileResponse: token || "" });

          if (isInputError(result.error)) {
            result.error.issues.forEach((issue) => {
              setError(issue.path.join(".") as any, { type: "server", message: issue.message });
            });
          } else if (result.error) {
            setError("root", { type: "server", message: result.error.message });
          } else {
            form.setValue("name", "");
            form.setValue("email", "");
            form.setValue("subject", "");
            form.setValue("message", "");
          }
        })}
      >
        <FieldGroup className="grid sm:grid-cols-2">
          <FormInputField
            id="contact-name"
            label="Nombre"
            placeholder="Ej: Pedro Pérez"
            error={errors.name}
            {...register("name")}
          />
          <FormInputField
            id="contact-email"
            label="Email"
            placeholder="Ej: pepe@ejemplo.com"
            error={errors.email}
            {...register("email")}
          />
        </FieldGroup>
        <FormInputField
          id="contact-subject"
          label="Asunto"
          placeholder="¿De qué te gustaría hablar?"
          error={errors.subject}
          autoComplete="off"
          {...register("subject")}
        />

        <FormTextareaField
          id="contact-message"
          label="Mensaje"
          placeholder="Escribe tu mensaje aquí..."
          rows={4}
          error={errors.message}
          {...register("message")}
        />
        {error ? <FieldError>{error}</FieldError> : null}

        {isSubmitSuccessful ? <p className="text-sm text-green-600">¡Mensaje enviado con éxito!</p> : null}

        {CF_TURNSTILE_SITE_KEY ? (
          <Turnstile siteKey={CF_TURNSTILE_SITE_KEY} options={{ theme: "dark", size: "flexible" }} />
        ) : null}

        <div className="flex justify-between gap-5">
          <div></div>
          <Button type="submit" disabled={isSubmitting}>
            <SendIcon className="h-4 w-4" />
            Enviar Mensaje
          </Button>
        </div>
      </form>
    </>
  );
}
