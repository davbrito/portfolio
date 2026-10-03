"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants, type Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTurnstile } from "@/hooks/use-turnstile";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, Download } from "lucide-react";
import type { ComponentProps, MouseEvent } from "react";
import { useRef, useState } from "react";

export type CvLanguage = "es" | "en";

const LANGUAGES: { value: CvLanguage; label: string; hint: string }[] = [
  { value: "es", label: "Español", hint: "ES" },
  { value: "en", label: "English", hint: "EN" },
];

interface CvDownloadButtonProps {
  label: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

export function CvDownloadButton({ label, className, variant = "outline" }: CvDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const openInNewTabRef = useRef(false);
  const languageRef = useRef<CvLanguage>("es");

  const { widget: turnstileWidget, reset: resetTurnstile } = useTurnstile({
    onSuccess: (token) => {
      void startDownload(token, languageRef.current, openInNewTabRef.current);
    },
    onError: () => {
      setLoading(false);
    },
  });

  function handleDownload(language: CvLanguage, event: MouseEvent<HTMLElement>) {
    // Ctrl/Cmd/Shift+click or a middle-click (auxclick, button 1) should open the CV in a
    // new tab, like a regular link. Ignore other auxiliary buttons (e.g. right-click).
    if (event.type === "auxclick" && event.button !== 1) return;

    languageRef.current = language;
    openInNewTabRef.current = event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
    setLoading(true);
    resetTurnstile();
  }

  async function startDownload(turnstileToken: string, language: CvLanguage, openInNewTab: boolean) {
    try {
      const params = new URLSearchParams({ lang: language, cf_turnstile_token: turnstileToken });
      const url = `/curriculum.pdf?${params}`;

      if (openInNewTab) {
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const blob = await res.blob();
      downloadBlob(blob, res);
    } finally {
      setLoading(false);
    }
  }

  function downloadBlob(blob: Blob, res: Response) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
    a.href = url;
    a.download = match ? decodeURIComponent(match[1].trim()) : "curriculum.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AlertDialog open={loading}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Verificación de seguridad</AlertDialogTitle>
            <AlertDialogDescription>Confirma que eres humano para continuar con la descarga.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center">{turnstileWidget}</div>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant }), className)} disabled={loading}>
          <Download className="h-4 w-4" />
          <span className="ml-2">{loading ? "Descargando" : label}</span>
          {loading ? (
            <span className="ml-3 inline-flex h-5 w-5 items-center justify-center">
              <CircularProgress progress={null} />
            </span>
          ) : (
            <ChevronDownIcon className="ml-1.5 h-3.5 w-3.5 opacity-80" aria-hidden />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Idioma del CV</DropdownMenuLabel>
            {LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.value}
                onClick={(event) => handleDownload(language.value, event)}
                onAuxClick={(event) => handleDownload(language.value, event)}
                className="justify-between text-sm"
              >
                {language.label}
                <span className="text-muted-foreground font-mono text-[11px]">{language.hint}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
