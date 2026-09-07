import { Mono } from "@/components/pages/landing/primitives";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * Espejo del formulario de contacto: lo que se escribe en los campos se va
 * componiendo como un comando de CLI, escribiéndose carácter a carácter.
 * Es decorativo — el lector de pantalla ya tiene los campos reales.
 */

export interface EchoFlag {
  /** Nombre del campo en el formulario. */
  field: string;
  /** Bandera mostrada en el comando. */
  flag: string;
  value: string;
}

const MAX_LENGTH = 72;

function sanitize(value: string) {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > MAX_LENGTH ? `${flat.slice(0, MAX_LENGTH)}…` : flat;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    const frame = requestAnimationFrame(update);
    query.addEventListener("change", update);

    return () => {
      cancelAnimationFrame(frame);
      query.removeEventListener("change", update);
    };
  }, []);

  return reduced;
}

/** Avanza (o retrocede) un carácter por tick hasta alcanzar el valor real. */
function useTypewriter(target: string, instant: boolean) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (shown === target) return;

    if (instant) {
      const frame = requestAnimationFrame(() => setShown(target));
      return () => cancelAnimationFrame(frame);
    }

    const forward = target.startsWith(shown);
    const id = setTimeout(
      () => {
        setShown((current) =>
          forward ? target.slice(0, current.length + 1) : current.slice(0, Math.max(0, current.length - 2)),
        );
      },
      forward ? 18 : 8,
    );

    return () => clearTimeout(id);
  }, [shown, target, instant]);

  return shown;
}

function FlagLine({
  flag,
  value,
  active,
  instant,
  continuation,
}: {
  flag: string;
  value: string;
  active: boolean;
  instant: boolean;
  continuation: boolean;
}) {
  const shown = useTypewriter(value, instant);

  if (!shown && !active) return null;

  return (
    <div className="animate-flag-in flex flex-wrap items-baseline gap-x-1.5 pl-4">
      <span className="text-primary/80">--{flag}</span>
      <span className="text-foreground break-all">
        &quot;{shown}
        {active ? <span className="caret-blink" /> : null}&quot;
      </span>
      {continuation ? <span className="text-muted-foreground/50">\</span> : null}
    </div>
  );
}

export function TerminalEcho({
  flags,
  activeField,
  className,
}: {
  flags: EchoFlag[];
  activeField: string | null;
  className?: string;
}) {
  const instant = usePrefersReducedMotion();
  const visible = flags.filter((flag) => sanitize(flag.value).length > 0 || flag.field === activeField);

  return (
    <div
      className={cn("border-border bg-background/70 border px-3 py-2.5 font-mono text-[11px] leading-6", className)}
      aria-hidden
    >
      <div className="flex items-baseline gap-1.5">
        <span className="text-primary">$</span>
        <span className="text-foreground">contact send</span>
        {visible.length > 0 ? <span className="text-muted-foreground/50">\</span> : null}
        {visible.length === 0 ? <span className="caret-blink text-muted-foreground/60" /> : null}
      </div>

      {visible.map((flag, index) => (
        <FlagLine
          key={flag.field}
          flag={flag.flag}
          value={sanitize(flag.value)}
          active={flag.field === activeField}
          instant={instant}
          continuation={index < visible.length - 1}
        />
      ))}

      {visible.length === 0 ? (
        <Mono className="text-muted-foreground/50 mt-1 block">escribe para componer el comando</Mono>
      ) : null}
    </div>
  );
}
