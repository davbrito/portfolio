import { Github, Linkedin, Mail } from "lucide-react";

export const icons = {
  github: (className) => <Github className={className} />,
  linkedin: (className) => <Linkedin className={className} />,
  mail: (className) => <Mail className={className} />,
} satisfies Record<string, (className: string) => React.ReactElement>;

export type IconName = keyof typeof icons;
