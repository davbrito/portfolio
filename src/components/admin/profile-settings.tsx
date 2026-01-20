"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useActionQuery } from "@/lib/query";
import { cn } from "@/lib/utils";
import { profilePayloadSchema, SKILL_LEVELS, type ProfilePayloadInput } from "@/lib/validators/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { actions, isInputError } from "astro:actions";
import { AlertCircle, CheckCircle2, Loader2Icon, SaveIcon, Trash2Icon } from "lucide-react";
import { useId } from "react";
import { ErrorCode, useDropzone, type FileRejection } from "react-dropzone";
import {
  Controller,
  useController,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormClearErrors,
  type UseFormRegister,
  type UseFormSetError,
} from "react-hook-form";
import { FormInputField, FormSelectField, FormTextareaField } from "../form-fields";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

const DEFAULT_SKILL_GROUPS = ["Frontend", "Backend", "Herramientas & Cloud"];

export function ProfileSettings() {
  const { data } = useActionQuery(actions.profile.get);
  const mutation = useMutation({
    mutationFn: actions.profile.upsert.orThrow,
    onSuccess(data, variables, onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: [actions.profile.get.toString()] });
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

  const { handleSubmit, formState, register, setError, clearErrors, control } = useForm({
    resolver: zodResolver(profilePayloadSchema),
    values: data ?? undefined,
  });
  const { errors, isSubmitting, isSubmitSuccessful, isLoading } = formState;

  const rootError = errors.root?.message;

  if (!data) {
    return (
      <div className="m-auto">
        <Spinner />
      </div>
    );
  }

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

  const skillGroups = [...new Set(data?.skills?.map((skill) => skill.group).concat(DEFAULT_SKILL_GROUPS))];

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
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
        <CardContent className="space-y-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              actions.profile.revalidate();
            }}
          >
            Regenerar portafolio
          </Button>
          <FieldGroup>
            <FieldSet>
              <FieldGroup className="grid md:grid-cols-2">
                <Field className="col-span-2">
                  <FieldLabel htmlFor="active">Habilitar Perfil Público</FieldLabel>
                  <Controller
                    control={control}
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
          </FieldGroup>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-6">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Experiencia</FieldLegend>
              <ExperienceSection control={control} register={register} errors={errors} />
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Tecnologías</FieldLegend>
              <SkillsSection control={control} register={register} errors={errors} groups={skillGroups} />
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Proyectos</FieldLegend>
              <ProjectsSection control={control} register={register} errors={errors} />
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Imagen de sección {'"Sobre mí"'}</FieldLegend>
              <FieldGroup className="grid gap-4 md:grid-cols-2">
                <Field className="col-span-2" data-invalid={!!errors.aboutImage}>
                  <FieldLabel>Imagen</FieldLabel>
                  <ImageUpload
                    error={errors.aboutImage?.message}
                    control={control}
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
          </FieldGroup>
        </CardContent>
      </Card>
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
        <FieldError>{rootError}</FieldError>
      </Field>
    </form>
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
  setError: UseFormSetError<ProfilePayloadInput>;
  clearErrors: UseFormClearErrors<ProfilePayloadInput>;
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

function ExperienceSection({
  control,
  register,
  errors,
}: {
  control: Control<ProfilePayloadInput>;
  register: UseFormRegister<ProfilePayloadInput>;
  errors: FieldErrors<ProfilePayloadInput>;
}) {
  const experienceFields = useFieldArray({
    control,
    name: "experiences",
  });
  return (
    <FieldGroup className="space-y-4">
      {experienceFields.fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Agrega tu experiencia profesional para mostrarla en la sección principal.
        </p>
      ) : null}
      {experienceFields.fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Experiencia {index + 1}</p>
            <Button type="button" variant="ghost" onClick={() => experienceFields.remove(index)}>
              Eliminar
            </Button>
          </div>
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <FormInputField
              {...register(`experiences.${index}.title`)}
              label="Cargo"
              error={errors.experiences?.[index]?.title}
            />
            <FormInputField
              {...register(`experiences.${index}.company`)}
              label="Empresa"
              error={errors.experiences?.[index]?.company}
            />
            <FormInputField
              {...register(`experiences.${index}.location`)}
              label="Ubicación"
              error={errors.experiences?.[index]?.location}
            />
            <FormInputField
              {...register(`experiences.${index}.period`)}
              label="Período"
              error={errors.experiences?.[index]?.period}
              placeholder="Ene 2020 - Dic 2022"
            />
            <FormTextareaField
              {...register(`experiences.${index}.highlights`)}
              label="Logros"
              description="Un logro por línea"
              error={errors.experiences?.[index]?.highlights}
              containerClassName="col-span-2"
            />
          </FieldGroup>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          experienceFields.append({
            title: "",
            company: "",
            location: "",
            period: "",
            highlights: "",
          })
        }
      >
        Agregar experiencia
      </Button>
    </FieldGroup>
  );
}

function SkillsSection({
  control,
  register,
  errors,
  groups,
}: {
  control: Control<ProfilePayloadInput>;
  register: UseFormRegister<ProfilePayloadInput>;
  errors: FieldErrors<ProfilePayloadInput>;
  groups: string[];
}) {
  const id = useId();
  const skillFields = useFieldArray({ control, name: "skills" });

  return (
    <FieldGroup className="gap-0">
      <datalist id={`${id}-skill-groups`}>
        {groups.map((group) => (
          <option key={group} value={group} />
        ))}
      </datalist>
      {skillFields.fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">Añade las tecnologías y habilidades que deseas destacar.</p>
      ) : null}
      {skillFields.fields.map((field, index) => (
        <div key={field.id} className="space-y-1 rounded-xl border-b p-4">
          <FieldGroup className="flex-row">
            <FormInputField
              {...register(`skills.${index}.group`)}
              label="Grupo"
              error={errors.skills?.[index]?.group}
              containerClassName="col-span-2"
              list={`${id}-skill-groups`}
            />
            <FormInputField {...register(`skills.${index}.name`)} label="Nombre" error={errors.skills?.[index]?.name} />
            <Controller
              control={control}
              name={`skills.${index}.level` as const}
              render={({ field, fieldState }) => (
                <FormSelectField
                  label="Nivel"
                  error={fieldState.error}
                  {...field}
                  options={SKILL_LEVELS.map((level) => ({ value: level, label: level }))}
                  placeholder="Selecciona un nivel..."
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="self-center"
              onClick={() => skillFields.remove(index)}
            >
              <Trash2Icon />
            </Button>
          </FieldGroup>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          skillFields.append({
            name: "",
            level: "",
            group: "",
          })
        }
      >
        Agregar skill
      </Button>
    </FieldGroup>
  );
}

function ProjectsSection({
  control,
  register,
  errors,
}: {
  control: Control<ProfilePayloadInput>;
  register: UseFormRegister<ProfilePayloadInput>;
  errors: FieldErrors<ProfilePayloadInput>;
}) {
  const projectFields = useFieldArray({ control, name: "projects" });
  const tagError = (index: number) => errors.projects?.[index]?.tags;
  return (
    <FieldGroup className="space-y-4">
      {projectFields.fields.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Comparte algunos proyectos destacados para mostrarlos en el portafolio.
        </p>
      ) : null}
      {projectFields.fields.map((field, index) => (
        <div key={field.id} className="space-y-4 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Proyecto {index + 1}</p>
            <Button type="button" variant="ghost" onClick={() => projectFields.remove(index)}>
              Eliminar
            </Button>
          </div>
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <FormInputField
              {...register(`projects.${index}.title`)}
              label="Título"
              error={errors.projects?.[index]?.title}
            />
            <FormInputField
              {...register(`projects.${index}.url`)}
              label="URL"
              type="url"
              error={errors.projects?.[index]?.url}
              placeholder="https://..."
            />
            <FormInputField
              {...register(`projects.${index}.repoUrl`)}
              label="Repositorio"
              type="url"
              error={errors.projects?.[index]?.repoUrl}
              placeholder="https://github.com/..."
            />
            <FormInputField
              {...register(`projects.${index}.image`)}
              label="Imagen"
              type="url"
              error={errors.projects?.[index]?.image}
              placeholder="https://..."
            />
            <FormInputField
              {...register(`projects.${index}.imageAlt`)}
              label="Texto alternativo"
              error={errors.projects?.[index]?.imageAlt}
            />
            <FormTextareaField
              {...register(`projects.${index}.description`)}
              label="Descripción"
              error={errors.projects?.[index]?.description}
              containerClassName="col-span-2"
            />
            <Controller
              control={control}
              name={`projects.${index}.tags`}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error} className="col-span-2">
                  <FieldLabel>Tags</FieldLabel>
                  <TagsInput
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Escribe y presiona Enter"
                  />
                  <FieldDescription>Presiona Enter o coma para agregar.</FieldDescription>
                  {fieldState.error || tagError(index) ? (
                    <FieldError errors={[fieldState.error, tagError(index)]} />
                  ) : null}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          projectFields.append({
            title: "",
            description: "",
            url: "",
            repoUrl: "",
            image: "",
            imageAlt: "",
            tags: [],
          })
        }
      >
        Agregar proyecto
      </Button>
    </FieldGroup>
  );
}

function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="border-input dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 flex flex-wrap items-center gap-2 rounded-none border bg-transparent px-2.5 py-2 text-xs transition-colors focus-within:ring-1">
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px]"
        >
          {tag}
          <button
            type="button"
            className="text-muted-foreground hover:text-primary"
            onClick={() => onChange(value.filter((item) => item !== tag))}
            aria-label={`Eliminar ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <Input
        className="h-auto min-w-40 flex-1 border-0 p-0 text-xs shadow-none focus-visible:ring-0"
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== ",") return;
          event.preventDefault();
          const target = event.target as HTMLInputElement;
          const nextTag = target.value.trim().replace(/,$/, "");
          if (!nextTag || value.includes(nextTag)) return;
          onChange([...value, nextTag]);
          target.value = "";
        }}
        onBlur={(event) => {
          const nextTag = event.currentTarget.value.trim();
          if (nextTag && !value.includes(nextTag)) {
            onChange([...value, nextTag]);
          }
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}
