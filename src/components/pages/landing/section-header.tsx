export function SectionHeader({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="text-primary font-mono leading-none font-semibold">
        {number.toString().padStart(2, "0")}.
      </span>
      <h2 className="text-3xl leading-none font-bold">{title}</h2>
      <div className="border-border ml-4 grow border-t" />
    </div>
  );
}
