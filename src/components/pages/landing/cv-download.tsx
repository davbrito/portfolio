"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { useTurnstile } from "@/hooks/use-turnstile";
import { Download } from "lucide-react";
import type { ComponentProps, MouseEvent } from "react";
import { useRef, useState } from "react";

interface CvDownloadButtonProps {
  label: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

export function CvDownloadButton({ label, className, variant = "outline" }: CvDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const openInNewTabRef = useRef(false);

  const { widget: turnstileWidget, reset: resetTurnstile } = useTurnstile({
    onSuccess: (token) => {
      void startDownload(token, openInNewTabRef.current);
    },
    onError: () => {
      setLoading(false);
    },
  });

  function handleDownload(event: MouseEvent<HTMLButtonElement>) {
    // Ctrl/Cmd/Shift+click or a middle-click (auxclick, button 1) should open the CV in a
    // new tab, like a regular link. Ignore other auxiliary buttons (e.g. right-click).
    if (event.type === "auxclick" && event.button !== 1) return;

    openInNewTabRef.current = event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1;
    setLoading(true);
    resetTurnstile();
  }

  async function startDownload(turnstileToken: string, openInNewTab: boolean) {
    try {
      const url = `/curriculum.pdf?cf_turnstile_token=${encodeURIComponent(turnstileToken)}`;

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
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={handleDownload}
        onAuxClick={handleDownload}
        disabled={loading}
      >
        <Download className="h-4 w-4" />
        <span className="ml-2">{loading ? "Descargando" : label}</span>
        {loading && (
          <span className="ml-3 inline-flex h-5 w-5 items-center justify-center">
            <CircularProgress progress={null} />
          </span>
        )}
      </Button>
    </>
  );
}
