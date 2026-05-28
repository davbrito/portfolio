"use client";

import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Download } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

interface CvDownloadButtonProps {
  label: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

const RADIUS = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CvDownloadButton({ label, className, variant = "outline" }: CvDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  async function handleDownload() {
    setLoading(true);
    setProgress(null);

    try {
      const res = await fetch("/curriculum.pdf");
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const contentLength = Number(res.headers.get("Content-Length"));
      if (contentLength > 0) setProgress(0);

      const reader = res.body?.getReader();

      if (!reader) {
        const blob = await res.blob();
        downloadBlob(blob, res);
        return;
      }

      const chunks: BlobPart[] = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          receivedLength += value.length;
          if (contentLength > 0) {
            setProgress(Math.round((receivedLength / contentLength) * 100));
          }
        }
      }
      setProgress(100)
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

  const progressOffset = progress !== null ? CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100 : 0;

  return (
    <Button type="button" variant={variant} className={className} onClick={handleDownload} disabled={loading}>
      <Download className="h-4 w-4" />
      <span className="ml-2">{loading ? "Descargando" : label}</span>
      {loading && (
        <span className="ml-3 inline-flex h-5 w-5 items-center justify-center">
          <CircularProgress progress={progress} />
        </span>
      )}
    </Button>
  );
}
