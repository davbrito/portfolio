import { Mono, Panel, PanelHeader, StatusDot } from "@/components/pages/landing/primitives";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Artefacto visual del hero: consola de observabilidad.
 *
 * El stream es sintético (está etiquetado como tal en la interfaz): existe
 * para demostrar instrumentación y lectura de series temporales, no para
 * reportar métricas reales de producción.
 */

const SAMPLES = 44;

interface SeriesSpec {
  id: string;
  label: string;
  unit: string;
  decimals: number;
  seed: number;
  base: number;
  spread: number;
  min: number;
  max: number;
}

const SERIES: SeriesSpec[] = [
  { id: "lat", label: "Latencia p95", unit: "ms", decimals: 0, seed: 7331, base: 46, spread: 9, min: 22, max: 98 },
  {
    id: "rps",
    label: "Throughput",
    unit: "req/s",
    decimals: 0,
    seed: 4211,
    base: 1280,
    spread: 190,
    min: 620,
    max: 2280,
  },
  { id: "err", label: "Tasa de error", unit: "%", decimals: 2, seed: 9137, base: 0.14, spread: 0.12, min: 0, max: 1.4 },
];

const LOG_EVENTS = [
  ["ok", "edge/render", "ssr stream completado"],
  ["ok", "api/query", "cache hit ratio 0.94"],
  ["ok", "worker/queue", "lote drenado sin retries"],
  ["warn", "db/pool", "conexiones al 71% de capacidad"],
  ["ok", "ci/pipeline", "build reproducible verificado"],
  ["ok", "cdn/purge", "invalidación propagada"],
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Serie determinista: el servidor y el cliente renderizan lo mismo al hidratar. */
function seedSeries({ seed, base, spread, min, max }: SeriesSpec): number[] {
  let state = seed;
  const next = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  let value = base;
  return Array.from({ length: SAMPLES }, () => {
    value = clamp(value + (next() - 0.5) * spread, min, max);
    return value;
  });
}

function sparkPath(values: number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/**
 * Formato es-ES calculado a mano: `toLocaleString` puede diferir entre el
 * runtime del servidor y el navegador y romper la hidratación.
 */
function format(value: number, decimals: number) {
  const [integer, fraction] = value.toFixed(decimals).split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return fraction ? `${grouped},${fraction}` : grouped;
}

interface LogLine {
  id: number;
  time: string;
  level: string;
  scope: string;
  message: string;
}

const INITIAL_LOG: LogLine[] = LOG_EVENTS.slice(0, 3).map(([level, scope, message], index) => ({
  id: index,
  time: "--:--:--",
  level,
  scope,
  message,
}));

export function OpsConsole() {
  const [series, setSeries] = useState<Record<string, number[]>>(() =>
    Object.fromEntries(SERIES.map((spec) => [spec.id, seedSeries(spec)])),
  );
  const [activeId, setActiveId] = useState(SERIES[0].id);
  const [running, setRunning] = useState(true);
  const [log, setLog] = useState<LogLine[]>(INITIAL_LOG);
  const ticksRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (document.visibilityState === "hidden") return;

      setSeries((current) => {
        const next: Record<string, number[]> = {};
        for (const spec of SERIES) {
          const values = current[spec.id];
          const last = values[values.length - 1];
          const drift = (Math.random() - 0.5) * spec.spread;
          next[spec.id] = [...values.slice(1), clamp(last + drift, spec.min, spec.max)];
        }
        return next;
      });

      ticksRef.current += 1;

      if (ticksRef.current % 3 === 0) {
        const event = LOG_EVENTS[Math.floor(Math.random() * LOG_EVENTS.length)];
        setLog((lines) =>
          [
            {
              id: ticksRef.current + INITIAL_LOG.length,
              time: new Date().toISOString().slice(11, 19),
              level: event[0],
              scope: event[1],
              message: event[2],
            },
            ...lines,
          ].slice(0, 3),
        );
      }
    }, 1600);

    return () => clearInterval(id);
  }, [running]);

  const spec = SERIES.find((item) => item.id === activeId) ?? SERIES[0];
  const values = series[spec.id];
  const current = values[values.length - 1];
  const previous = values[values.length - 2];
  const delta = current - previous;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  return (
    <Panel className="overflow-hidden">
      <PanelHeader
        id="OPS"
        title="runtime/telemetry"
        meta={
          <span className="inline-flex items-center gap-2">
            <StatusDot label={running ? "Stream activo" : "Stream en pausa"} idle={!running} />
            <span className="ml-2.5">{running ? "Live" : "Pausa"}</span>
          </span>
        }
      />

      {/* Selector de serie */}
      <div className="border-border grid grid-cols-3 border-b" role="tablist" aria-label="Series de telemetría">
        {SERIES.map((item) => {
          const selected = item.id === spec.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "pressable border-border/60 focus-visible:ring-ring border-r px-3 py-2 text-left last:border-r-0 focus-visible:ring-1 focus-visible:outline-none",
                selected
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <Mono className="block truncate">{item.label}</Mono>
              <span
                className={cn("mt-1.5 block h-px w-full", selected ? "bg-primary" : "bg-transparent")}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {/* Lectura principal */}
      <div className="flex items-end justify-between gap-4 px-4 pt-4">
        <div>
          <Mono className="text-muted-foreground">Valor actual</Mono>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-foreground font-mono text-3xl leading-none font-semibold tabular-nums">
              {format(current, spec.decimals)}
            </span>
            <Mono className="text-muted-foreground">{spec.unit}</Mono>
          </div>
        </div>
        <div className="text-right">
          <Mono className="text-muted-foreground tabular-nums">
            <span className="text-primary" aria-hidden>
              {delta >= 0 ? "▲" : "▼"}
            </span>{" "}
            {format(Math.abs(delta), Math.max(spec.decimals, 1))}
          </Mono>
          <Mono className="text-muted-foreground mt-1 block tabular-nums">prom {format(average, spec.decimals)}</Mono>
        </div>
      </div>

      {/* Sparkline */}
      <div className="text-muted-foreground mt-3 flex items-center justify-between px-4">
        <Mono className="tabular-nums">min {format(min, spec.decimals)}</Mono>
        <Mono className="tabular-nums">max {format(max, spec.decimals)}</Mono>
      </div>
      <div className="relative px-4 pt-1">
        <svg viewBox="0 0 300 76" preserveAspectRatio="none" className="h-24 w-full" role="img" aria-hidden>
          {[0, 25, 50, 75].map((y) => (
            <line key={y} x1="0" y1={y} x2="300" y2={y} className="stroke-border" strokeWidth="0.5" />
          ))}
          <path
            d={`${sparkPath(values, 300, 72)} L300,76 L0,76 Z`}
            className="fill-primary/8"
            stroke="none"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={sparkPath(values, 300, 72)}
            fill="none"
            className="stroke-primary"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {running ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="scan-sweep bg-primary/25 h-px w-full" />
          </div>
        ) : null}
      </div>

      {/* Registro de eventos */}
      <div className="border-border mt-2 border-t">
        <ul className="divide-border/60 divide-y">
          {log.map((line) => (
            <li key={line.id} className="flex items-center gap-2 px-4 py-1.5">
              <Mono className="text-muted-foreground shrink-0 tabular-nums">{line.time}</Mono>
              <Mono className={cn("shrink-0", line.level === "warn" ? "text-foreground" : "text-primary")}>
                {line.level}
              </Mono>
              <Mono className="text-muted-foreground shrink-0">{line.scope}</Mono>
              <span className="text-muted-foreground/80 truncate font-mono text-[10px] lowercase">{line.message}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Control del stream */}
      <div className="border-border flex items-center justify-between gap-3 border-t px-4 py-2">
        <Mono className="text-muted-foreground">stream sintético</Mono>
        <button
          type="button"
          onClick={() => setRunning((value) => !value)}
          aria-pressed={!running}
          className="pressable border-border hover:border-primary hover:text-primary focus-visible:ring-ring text-muted-foreground inline-flex items-center gap-1.5 border px-2 py-1 focus-visible:ring-1 focus-visible:outline-none"
        >
          {running ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
          <Mono>{running ? "Pausar" : "Reanudar"}</Mono>
        </button>
      </div>
    </Panel>
  );
}
