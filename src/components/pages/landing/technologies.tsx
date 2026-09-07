import { Meter, Mono, Panel, PanelHeader } from "@/components/pages/landing/primitives";
import { classifyTech, getLayer, layerIndex, pad } from "@/components/pages/landing/tech-layers";
import type { TechnologyGroup } from "@/data/portfolio";

interface Props {
  technologies: TechnologyGroup[];
}

const LEVEL_VALUE: Record<string, number> = {
  Principiante: 1,
  Intermedio: 2,
  Avanzado: 3,
  Experto: 4,
};

export default function Technologies({ technologies }: Props) {
  // Cada grupo declarado en el perfil se ancla a una capa lógica del sistema
  // y la matriz se ordena de la superficie (cliente) hacia la infraestructura.
  const rows = technologies
    .map((group) => ({ group, layer: getLayer(classifyTech(group.title)) }))
    .sort((a, b) => layerIndex(a.layer.id) - layerIndex(b.layer.id));

  const total = technologies.reduce((sum, group) => sum + group.skills.length, 0);
  const activeLayers = new Set(rows.map((row) => row.layer.id)).size;

  if (total === 0) return null;

  return (
    <Panel>
      <PanelHeader id="MTX" title="infra://matriz-de-capacidades" meta={`${pad(total)} módulos`} />

      {/* Resumen de la matriz */}
      <dl className="divide-border border-border grid grid-cols-3 divide-x border-b">
        <div className="px-4 py-3">
          <dt>
            <Mono className="text-muted-foreground">Módulos</Mono>
          </dt>
          <dd className="text-foreground mt-1 font-mono text-sm tabular-nums">{pad(total)}</dd>
        </div>
        <div className="px-4 py-3">
          <dt>
            <Mono className="text-muted-foreground">Capas activas</Mono>
          </dt>
          <dd className="text-foreground mt-1 font-mono text-sm tabular-nums">
            {activeLayers}
            <span className="text-muted-foreground/60">/4</span>
          </dd>
        </div>
        <div className="px-4 py-3">
          <dt>
            <Mono className="text-muted-foreground">Grupos</Mono>
          </dt>
          <dd className="text-foreground mt-1 font-mono text-sm tabular-nums">{pad(rows.length)}</dd>
        </div>
      </dl>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <caption className="sr-only">Capacidades técnicas por capa lógica del sistema</caption>
          <thead>
            <tr className="border-border border-b">
              <th scope="col" className="px-4 py-2">
                <Mono className="text-muted-foreground">Módulo</Mono>
              </th>
              <th scope="col" className="hidden px-4 py-2 sm:table-cell">
                <Mono className="text-muted-foreground">Capa</Mono>
              </th>
              <th scope="col" className="px-4 py-2 text-right">
                <Mono className="text-muted-foreground">Dominio</Mono>
              </th>
            </tr>
          </thead>

          {rows.map(({ group, layer }) => (
            <tbody key={group.title} className="border-border border-b last:border-b-0">
              <tr className="bg-muted/40">
                <th colSpan={3} scope="colgroup" className="border-l-primary border-l-2 px-4 py-2 text-left">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Mono className="text-primary">{layer.code}</Mono>
                    <Mono className="text-foreground">{group.title}</Mono>
                    <Mono className="text-muted-foreground/70 font-normal normal-case">{layer.scope}</Mono>
                  </span>
                </th>
              </tr>

              {group.skills.map((skill, index) => (
                <tr key={skill.name} className="border-border/60 hover:bg-muted/30 border-t transition-colors">
                  <td className="px-4 py-2">
                    <span className="flex items-center gap-3">
                      <Mono className="text-muted-foreground/60 tabular-nums">{pad(index + 1)}</Mono>
                      <span className="text-foreground font-mono text-xs">{skill.name}</span>
                    </span>
                  </td>
                  <td className="hidden px-4 py-2 sm:table-cell">
                    <Mono className="text-muted-foreground">{layer.name}</Mono>
                  </td>
                  <td className="px-4 py-2">
                    <span className="flex items-center justify-end gap-3">
                      <Mono className="text-muted-foreground">{skill.level}</Mono>
                      <Meter value={LEVEL_VALUE[skill.level] ?? 1} label={`Nivel ${skill.level} en ${skill.name}`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </Panel>
  );
}
