"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { profilePayloadSchema, type ProfilePayload, type ProfilePayloadInput } from "@/lib/validators/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { actions, isInputError } from "astro:actions";
import { AlertCircle, CheckCircle2, Loader2Icon, SaveIcon } from "lucide-react";
import { ErrorCode, useDropzone, type FileRejection } from "react-dropzone";
import {
  Controller,
  useController,
  useForm,
  useWatch,
  type Control,
  type UseFormClearErrors,
  type UseFormSetError,
} from "react-hook-form";
import { FormInputField, FormTextareaField } from "../form-fields";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

export function ProfileSettings() {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => actions.profile.get.orThrow(),
  });
  const mutation = useMutation({
    mutationFn: actions.profile.upsert.orThrow,
    onSuccess(data, variables, onMutateResult, context) {
      reset(data);
      context.client.invalidateQueries({ queryKey: ["profile"] });
    },
    onError(error) {
      if (isInputError(error)) {
        for (const issue of error.issues) {
          const key = issue.path.join(".") || "root";
          setError(key as any, {
            type: "server",
            message: issue.message,
          });
        }
      } else {
        setError("root", {
          type: "server",
          message: error?.message || "No se pudieron guardar los cambios del perfil",
        });
      }
    },
  });
  const form = useForm({
    resolver: zodResolver(profilePayloadSchema),
    values: query.data || undefined,
  });
  const { handleSubmit, formState, register, reset, setError, clearErrors } = form;
  const { errors, isSubmitting, isSubmitSuccessful, isLoading } = formState;

  const rootError = errors.root?.message;

  const statusBadge = isSubmitting ? (
    <span className="text-primary inline-flex items-center gap-2 text-sm">
      <Loader2Icon className="h-4 w-4 animate-spin" /> Guardando...
    </span>
  ) : isSubmitSuccessful ? (
    <span className="inline-flex items-center gap-2 text-sm text-emerald-600">
      <CheckCircle2 className="h-4 w-4" /> Guardado
    </span>
  ) : rootError ? (
    <span className="text-destructive inline-flex items-center gap-2 text-sm">
      <AlertCircle className="h-4 w-4" />
    </span>
  ) : isLoading ? (
    <Spinner />
  ) : null;

  const onSubmit = handleSubmit(async (formValues) => {
    await mutation.mutateAsync(formValues);
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">Perfil público</p>
            <h2 className="text-2xl font-bold">Información del perfil</h2>
            <p className="text-muted-foreground text-sm">Estos datos se muestran en la página principal.</p>
          </div>
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={onSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup className="grid md:grid-cols-2">
                <Field className="col-span-2">
                  <FieldLabel htmlFor="active">Habilitar Perfil Público</FieldLabel>
                  <Controller
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <Switch
                        id="active"
                        name={field.name}
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </Field>
                <FormInputField label="Nombre" error={errors.name} {...register("name")} />
                <FormInputField label="Título" error={errors.title} {...register("title")} />
                <FormInputField
                  label="Ubicación"
                  error={errors.location}
                  list="countries-list"
                  {...register("location")}
                />
                <datalist id="countries-list">
                  {getCountries().map((country) => (
                    <option key={country} value={country} />
                  ))}
                </datalist>
                <FormInputField {...register("experience")} label="Experiencia" error={errors.experience} />
                <FormInputField
                  {...register("description")}
                  label="Descripción corta"
                  error={errors.description}
                  containerClassName="col-span-2"
                />
                <FormTextareaField
                  {...register("brief")}
                  label="Resumen"
                  error={errors.brief}
                  containerClassName="col-span-2"
                />
                <FormTextareaField
                  {...register("aboutText")}
                  label="Sobre mí"
                  description="Cada párrafo en una línea nueva"
                  error={errors.aboutText}
                  containerClassName="col-span-2"
                />
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Imagen de sección {'"Sobre mí"'}</FieldLegend>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field className="col-span-2" data-invalid={!!errors.aboutImage}>
                  <FieldLabel>Imagen</FieldLabel>
                  <ImageUpload
                    error={errors.aboutImage?.message}
                    control={form.control}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                </Field>
                <FormInputField {...register("aboutImageAlt")} label="Texto alternativo" error={errors.aboutImageAlt} />
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Redes Sociales</FieldLegend>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  {...register("githubUrl")}
                  type="url"
                  label="GitHub URL"
                  error={errors.githubUrl}
                  placeholder="https://github.com/..."
                />
                <FormInputField
                  {...register("linkedinUrl")}
                  type="url"
                  label="LinkedIn URL"
                  error={errors.linkedinUrl}
                  placeholder="https://linkedin.com/in/..."
                />
                <FormInputField
                  {...register("email")}
                  type="email"
                  label="Email"
                  error={errors.email}
                  placeholder="me@example.com"
                />
              </FieldGroup>
            </FieldSet>
            <FieldError>{rootError}</FieldError>
            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="animate-spin" /> Guardando
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Guardar cambios
                  </>
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

function getCountries(lang = "es-VE"): string[] {
  const A = 65; // ASCII code for 'A'
  const Z = 90; // ASCII code for 'Z'
  const countryName = new Intl.DisplayNames([lang], { type: "region" });
  const countries = new Set<string>();

  for (let i = A; i <= Z; ++i) {
    for (let j = A; j <= Z; ++j) {
      const code = String.fromCharCode(i) + String.fromCharCode(j);
      const name = countryName.of(code);
      // Ensure the result is an actual country name and not just the code itself
      if (code !== name) {
        // countries[code] = name;
        countries.add(name!);
      }
    }
  }
  return Array.from(countries).sort();
}

function ImageUpload({
  error,
  control,
  clearErrors,
  setError,
}: {
  error: string | undefined;
  control: Control<ProfilePayloadInput>;
  setError: UseFormSetError<ProfilePayload>;
  clearErrors: UseFormClearErrors<ProfilePayload>;
}) {
  const { field } = useController({ name: "aboutImage", control });
  const { value: aboutImageValue, onChange } = field;

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: async ([file]) => {
      if (!file) return;
      const buffer = await file.bytes();
      const base64String = (buffer as any).toBase64();
      const dataUrl = `data:${file.type};base64,${base64String}`;
      onChange(dataUrl);
      clearErrors("aboutImage");
    },
    onDropRejected: (fileRejections: FileRejection[]) => {
      const firstError = fileRejections[0]?.errors?.[0];
      const code = firstError?.code;

      switch (code as ErrorCode) {
        case ErrorCode.FileTooLarge:
          setError("aboutImage", {
            type: "manual",
            message: "La imagen supera 2MB.",
          });
          return;
        case ErrorCode.FileInvalidType:
          setError("aboutImage", {
            type: "manual",
            message: "Formato de imagen no soportado.",
          });
          return;
      }
    },
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
    maxSize: 2 * 1024 * 1024,
    noClick: true,
    noKeyboard: true,
    useFsAccessApi: true,
  });

  const aboutImageAlt = useWatch({
    control,
    name: "aboutImageAlt",
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps({
          className: cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm transition",
            isDragActive ? "border-primary/70 bg-primary/5" : "border-muted-foreground/30",
          ),
        })}
      >
        <input {...getInputProps()} />
        <p className="text-muted-foreground">Arrastra una imagen o selecciona un archivo.</p>
        <p className="text-muted-foreground text-xs">PNG, JPG o WebP. Máx 2MB.</p>
      </div>
      {typeof aboutImageValue === "string" && aboutImageValue ? (
        <div className="overflow-hidden rounded-xl border">
          <img
            src={aboutImageValue}
            alt={typeof aboutImageAlt === "string" && aboutImageAlt ? aboutImageAlt : "Vista previa"}
            className="h-48 w-full object-contain"
          />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="secondary" onClick={open}>
          Seleccionar imagen
        </Button>
        {typeof aboutImageValue === "string" && aboutImageValue ? (
          <Button type="button" variant="ghost" onClick={() => onChange("")}>
            Quitar
          </Button>
        ) : null}
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}
