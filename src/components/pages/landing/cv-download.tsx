"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";

interface CvDownloadButtonProps {
  label: string;
  className?: string;
  variant?: ComponentProps<typeof Button>["variant"];
}

export function CvDownloadButton({ label, className, variant = "outline" }: CvDownloadButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={className}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Download className="h-4 w-4" />
        {label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descargar CV</DialogTitle>
            <DialogDescription>Tu navegador hará la solicitud protegida al PDF.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" action="/curriculum.pdf" method="GET">
            <Button type="submit" className="w-full">
              Descargar PDF
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
