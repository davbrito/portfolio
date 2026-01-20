"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Turnstile } from "@marsidev/react-turnstile";
import { CF_TURNSTILE_SITE_KEY } from "astro:env/client";
import { Download } from "lucide-react";
import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";

interface CvDownloadButtonProps {
  label: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

export function CvDownloadButton({ label, className, variant = "outline" }: CvDownloadButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !CF_TURNSTILE_SITE_KEY;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const token = formData.get("cf-turnstile-response") as string | null;
    if (!token) {
      event.preventDefault();
      setError("Completa el captcha para continuar.");
      return;
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        disabled={disabled}
      >
        <Download className="h-4 w-4" />
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descargar CV</DialogTitle>
            <DialogDescription>Completa la verificación para continuar.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit} action="/curriculum.pdf" method="GET">
            {error ? <p className="text-destructive text-xs">{error}</p> : null}

            {CF_TURNSTILE_SITE_KEY ? (
              <Turnstile
                siteKey={CF_TURNSTILE_SITE_KEY}
                options={{ theme: "dark", size: "flexible" }}
                onSuccess={() => setError(null)}
                onError={(error) => setError(error)}
                onExpire={() => setError("El captcha ha expirado. Por favor, inténtalo de nuevo.")}
              />
            ) : (
              <p className="text-muted-foreground text-xs">Turnstile no está configurado.</p>
            )}

            <Button type="submit" className="w-full" disabled={!CF_TURNSTILE_SITE_KEY}>
              Descargar PDF
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
