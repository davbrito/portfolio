import { Mono, Panel, PanelHeader, StatusDot } from "@/components/pages/landing/primitives";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * Artefacto del hero: Core Web Vitals reales de esta misma carga.
 *
 * No hay datos simulados — cada valor lo mide `web-vitals` en el navegador
 * de quien visita y se queda en la página; nada se envía a ningún servidor.
 */

interface VitalSpec {
  id: "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
  name: string;
  unit: string;
  decimals: number;
  good: number;
  poor: number;
}

const VITALS: VitalSpec[] = [
  { id: "LCP", name: "Largest Contentful Paint", unit: "ms", decimals: 0, good: 2500, poor: 4000 },
  { id: "INP", name: "Interaction to Next Paint", unit: "ms", decimals: 0, good: 200, poor: 500 },
  { id: "CLS", name: "Cumulative Layout Shift", unit: "", decimals: 3, good: 0.1, poor: 0.25 },
  { id: "FCP", name: "First Contentful Paint", unit: "ms", decimals: 0, good: 1800, poor: 3000 },
  { id: "TTFB", name: "Time to First Byte", unit: "ms", decimals: 0, good: 800, poor: 1800 },
];

const RATING_LABEL: Record<string, string> = {
  good: "Bueno",
  "needs-improvement": "Mejorable",
  poor: "Deficiente",
};

interface Reading {
  value: number;
  rating: string;
}

/** Formato es-ES calculado a mano: `toLocaleString` puede diferir entre runtimes. */
function format(value: number, decimals: number) {
  const [integer, fraction] = value.toFixed(decimals).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return fraction ? `${grouped},${fraction}` : grouped;
}

function ratingClass(rating: string | undefined) {
  if (rating === "good") return "text-primary";
  if (rating === "poor") return "text-destructive";
  if (rating === "needs-improvement") return "text-foreground";
  return "text-muted-foreground/60";
}

/** Escala de la barra: el umbral "deficiente" queda a dos tercios del ancho. */
function position(value: number, spec: VitalSpec) {
  return Math.min(100, (value / (spec.poor * 1.5)) * 100);
}

export function VitalsPanel() {
  const [readings, setReadings] = useState<Partial<Record<VitalSpec["id"], Reading>>>({});

  useEffect(() => {
    let mounted = true;

    const record = (metric: { name: string; value: number; rating: string }) => {
      if (!mounted) return;
      setReadings((current) => ({ ...current, [metric.name]: { value: metric.value, rating: metric.rating } }));
    };

    void import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      // `reportAllChanges` hace que el panel se actualice mientras la página
      // carga, en vez de esperar a que se cierre la pestaña.
      const live = { reportAllChanges: true };
      onLCP(record, live);
      onINP(record, live);
      onCLS(record, live);
      onFCP(record);
      onTTFB(record);
    });

    // Sin desplazamientos no hay evento de CLS: pasado el asentamiento, es 0.
    const settle = setTimeout(() => {
      if (!mounted) return;
      setReadings((current) => (current.CLS ? current : { ...current, CLS: { value: 0, rating: "good" } }));
    }, 2500);

    return () => {
      mounted = false;
      clearTimeout(settle);
    };
  }, []);

  const measured = VITALS.filter((spec) => readings[spec.id]).length;

  return (
    <Panel>
      <PanelHeader
        id="WV"
        title="vitals://esta-sesión"
        meta={
          <span className="inline-flex items-center gap-2">
            <StatusDot label={measured > 0 ? "Midiendo" : "En espera de métricas"} idle={measured === 0} />
            <span className="ml-2.5">
              {measured}/{VITALS.length}
            </span>
          </span>
        }
      />

      <ul className="divide-border/60 divide-y">
        {VITALS.map((spec) => {
          const reading = readings[spec.id];
          const goodEdge = position(spec.good, spec);
          const poorEdge = position(spec.poor, spec);

          return (
            <li key={spec.id} className="px-4 py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-baseline gap-2">
                  <Mono className="text-foreground">{spec.id}</Mono>
                  <Mono className="text-muted-foreground/70 hidden truncate normal-case sm:inline lg:hidden xl:inline">
                    {spec.name}
                  </Mono>
                </span>

                <span className="flex shrink-0 items-baseline gap-2">
                  {reading ? (
                    <>
                      <span className="text-foreground font-mono text-xs tabular-nums">
                        {format(reading.value, spec.decimals)}
                      </span>
                      {spec.unit ? <Mono className="text-muted-foreground">{spec.unit}</Mono> : null}
                      <Mono className={cn("w-20 text-right", ratingClass(reading.rating))}>
                        {RATING_LABEL[reading.rating] ?? reading.rating}
                      </Mono>
                    </>
                  ) : (
                    <Mono className="text-muted-foreground/60 w-20 text-right">
                      {spec.id === "INP" ? "interactúa" : "midiendo"}
                    </Mono>
                  )}
                </span>
              </div>

              {/* Barra de umbrales: bueno · mejorable · deficiente */}
              <span className="bg-secondary relative mt-2 block h-1 w-full" aria-hidden>
                <span className="bg-primary/20 absolute inset-y-0 left-0" style={{ width: `${goodEdge}%` }} />
                <span className="bg-border absolute inset-y-0 w-px" style={{ left: `${goodEdge}%` }} />
                <span className="bg-border absolute inset-y-0 w-px" style={{ left: `${poorEdge}%` }} />
                {reading ? (
                  <span
                    className={cn(
                      "absolute -top-0.5 -bottom-0.5 w-0.5",
                      reading.rating === "poor" ? "bg-destructive" : "bg-primary",
                    )}
                    style={{ left: `${position(reading.value, spec)}%` }}
                  />
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-border border-t px-4 py-2">
        <Mono className="text-muted-foreground">medición real · no sale del navegador</Mono>
      </div>
    </Panel>
  );
}
