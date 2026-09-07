import { Mono, Panel, PanelHeader, StatusDot } from "@/components/pages/landing/primitives";
import { TerminalEcho } from "@/components/pages/landing/terminal-echo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTurnstile } from "@/hooks/use-turnstile";
import { cn } from "@/lib/utils";
import { contactFormAction } from "#/actions/index.ts";
import { SendIcon } from "lucide-react";
import type { FocusEvent, ReactNode } from "react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface ContactFormProps {
  profileId: string;
}

const fieldClass =
  "h-9 rounded-none border-border bg-background/60 font-mono text-xs text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:ring-primary/30";

function TerminalField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline gap-1.5">
        <Mono className="text-primary" aria-hidden>
          &gt;
        </Mono>
        <Mono className="text-muted-foreground">{label}</Mono>
      </label>
      {children}
      {error ? (
        <Mono className="text-destructive" role="alert">
          err · {error}
        </Mono>
      ) : null}
    </div>
  );
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
  const values = useWatch({ control: form.control });
  const [activeField, setActiveField] = useState<string | null>(null);
  const error = errors.root?.message;

  // El eco de terminal necesita saber en qué campo está el cursor.
  const bind = (name: "name" | "email" | "subject" | "message") => {
    const registered = register(name);

    return {
      ...registered,
      onFocus: () => setActiveField(name),
      onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setActiveField((current) => (current === name ? null : current));
        return registered.onBlur(event);
      },
    };
  };
  const { widget: turnstileWidget, getToken: getTurnstileToken } = useTurnstile({ appearance: "interaction-only" });

  const status = isSubmitting ? "Transmitiendo" : error ? "Error" : isSubmitSuccessful ? "Entregado" : "En espera";

  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10">
      <div className="self-start md:sticky md:top-32 md:col-span-5">
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
          Canal abierto para propuestas de proyecto, colaboraciones y consultas técnicas. Los mensajes llegan
          directamente a mi bandeja: describe el contexto, el alcance y las restricciones y respondo con una lectura
          honesta de la viabilidad.
        </p>

        <dl className="border-border divide-border mt-6 divide-y border-y">
          <div className="flex items-center justify-between gap-4 py-2.5">
            <dt>
              <Mono className="text-muted-foreground">Protocolo</Mono>
            </dt>
            <dd>
              <Mono className="text-foreground">Formulario cifrado</Mono>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <dt>
              <Mono className="text-muted-foreground">Verificación</Mono>
            </dt>
            <dd>
              <Mono className="text-foreground">Turnstile</Mono>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <dt>
              <Mono className="text-muted-foreground">Respuesta estimada</Mono>
            </dt>
            <dd>
              <Mono className="text-foreground">&lt; 48 h</Mono>
            </dd>
          </div>
        </dl>
      </div>

      <div className="md:col-span-7">
        <Panel>
          <PanelHeader
            id="LNK"
            title="link://canal-de-contacto"
            meta={
              <span className="inline-flex items-center gap-2">
                <StatusDot label={`Estado del canal: ${status}`} />
                <span className="ml-2.5">{status}</span>
              </span>
            }
          />

          <form
            className="space-y-4 px-4 py-4"
            id="contact-form"
            onSubmit={handleSubmit(async (data) => {
              try {
                const turnstileToken = await getTurnstileToken();
                await contactFormAction({ data: { ...data, profileId, turnstileToken } });
                form.setValue("name", "");
                form.setValue("email", "");
                form.setValue("subject", "");
                form.setValue("message", "");
              } catch (error: any) {
                if (error.message[0] === "[") {
                  try {
                    const issues = JSON.parse(error.message) as any[];
                    issues.forEach((issue) => {
                      setError(issue.path.join(".") as any, { type: "server", message: issue.message });
                    });
                    return;
                  } catch {
                    //
                  }
                }

                setError("root", { type: "server", message: error.message });
              }
            })}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TerminalField id="contact-name" label="Nombre" error={errors.name?.message}>
                <Input
                  id="contact-name"
                  placeholder="Pedro Pérez"
                  aria-invalid={!!errors.name}
                  className={fieldClass}
                  {...bind("name")}
                />
              </TerminalField>
              <TerminalField id="contact-email" label="Email" error={errors.email?.message}>
                <Input
                  id="contact-email"
                  placeholder="pepe@ejemplo.com"
                  aria-invalid={!!errors.email}
                  className={fieldClass}
                  {...bind("email")}
                />
              </TerminalField>
            </div>

            <TerminalField id="contact-subject" label="Asunto" error={errors.subject?.message}>
              <Input
                id="contact-subject"
                placeholder="Arquitectura, producto, colaboración…"
                autoComplete="off"
                aria-invalid={!!errors.subject}
                className={fieldClass}
                {...bind("subject")}
              />
            </TerminalField>

            <TerminalField id="contact-message" label="Mensaje" error={errors.message?.message}>
              <Textarea
                id="contact-message"
                placeholder="Contexto, alcance y restricciones del proyecto…"
                rows={5}
                aria-invalid={!!errors.message}
                className={cn(fieldClass, "h-auto min-h-32 py-2 leading-relaxed")}
                {...bind("message")}
              />
            </TerminalField>

            <TerminalEcho
              activeField={activeField}
              flags={[
                { field: "name", flag: "name", value: values.name ?? "" },
                { field: "email", flag: "email", value: values.email ?? "" },
                { field: "subject", flag: "subject", value: values.subject ?? "" },
                { field: "message", flag: "message", value: values.message ?? "" },
              ]}
            />

            {turnstileWidget}

            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <Mono className={cn("text-muted-foreground", error && "text-destructive")} aria-live="polite">
                {error ? `err · ${error}` : isSubmitSuccessful ? "ok 200 · mensaje entregado" : "listo para transmitir"}
              </Mono>

              <button
                type="submit"
                disabled={isSubmitting}
                className="pressable bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-9 items-center justify-center gap-2 px-4 font-mono text-[11px] tracking-[0.14em] uppercase focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <SendIcon className="h-3.5 w-3.5" />
                {isSubmitting ? "Transmitiendo" : "Transmitir"}
              </button>
            </div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
