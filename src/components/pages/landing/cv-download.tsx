"use client";

import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { useTurnstile } from "@/hooks/use-turnstile";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

interface CvDownloadButtonProps {
  label: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

export function CvDownloadButton({ label, className, variant = "outline" }: CvDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const {
    widget: turnstileWidget,
    getToken: getTurnstileToken,
    needsInteraction: turnstileNeedsInteraction,
  } = useTurnstile();

  async function handleDownload() {
    setLoading(true);
    setProgress(null);

    try {
      const turnstileToken = await getTurnstileToken();
      const res = await fetch(`/curriculum.pdf?cf_turnstile_token=${encodeURIComponent(turnstileToken)}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const contentLength = Number(res.headers.get("Content-Length"));
      if (contentLength > 0) setProgress(0);

      if (!res.body) {
        const blob = await res.blob();
        downloadBlob(blob, res);
        return;
      }

      const chunks: BlobPart[] = [];
      let receivedLength = 0;

      for await (const chunk of res.body) {
        chunks.push(chunk);
        receivedLength += chunk.length;
        if (contentLength > 0) {
          setProgress(Math.round((receivedLength / contentLength) * 100));
        }
      }

      setProgress(100);
      const blob = new Blob(chunks, { type: "application/pdf" });
      downloadBlob(blob, res);
    } finally {
      setLoading(false);
      setProgress(null);
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
      <div
        className={cn(
          "fixed inset-0 z-50 items-center justify-center bg-black/10 p-4 supports-backdrop-filter:backdrop-blur-xs",
          turnstileNeedsInteraction ? "flex" : "hidden",
        )}
      >
        <div className="grid w-full max-w-[calc(100%-2rem)] gap-3 rounded-none bg-popover p-4 text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 sm:max-w-sm">
          <p className="text-sm font-medium">Verificación de seguridad</p>
          <p className="text-muted-foreground text-xs/relaxed">
            Confirma que eres humano para continuar con la descarga.
          </p>
          <div className="flex justify-center">{turnstileWidget}</div>
        </div>
      </div>
      <Button type="button" variant={variant} className={className} onClick={handleDownload} disabled={loading}>
        <Download className="h-4 w-4" />
        <span className="ml-2">{loading ? "Descargando" : label}</span>
        {loading && (
          <span className="ml-3 inline-flex h-5 w-5 items-center justify-center">
            <CircularProgress progress={progress} />
          </span>
        )}
      </Button>
    </>
  );
}
