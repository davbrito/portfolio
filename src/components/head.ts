interface MetaProps {
  title: string;
  description?: string;
}

export function getMeta(props: MetaProps) {
  const { title, description } = props;
  return [{ title: title }, ...(description ? [{ name: "description", content: description }] : [])];
}
