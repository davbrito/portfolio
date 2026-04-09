import { Mail } from "lucide-react";

type IconProps = {
  className: string;
};

function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.95c-2.94.64-3.56-1.25-3.56-1.25-.48-1.2-1.16-1.52-1.16-1.52-.95-.65.07-.64.07-.64 1.05.08 1.6 1.06 1.6 1.06.94 1.58 2.45 1.13 3.05.87.1-.67.37-1.13.67-1.4-2.35-.26-4.83-1.15-4.83-5.12 0-1.13.41-2.06 1.08-2.79-.11-.26-.47-1.32.1-2.75 0 0 .89-.28 2.9 1.06A10.2 10.2 0 0 1 12 6.68a10.2 10.2 0 0 1 2.64.35c2.01-1.34 2.9-1.06 2.9-1.06.57 1.43.21 2.49.1 2.75.67.73 1.08 1.66 1.08 2.79 0 3.98-2.49 4.85-4.86 5.1.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.98 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM3.5 8.5h2.96V20H3.5V8.5Zm4.8 0h2.84v1.57h.04c.4-.75 1.37-1.84 2.83-1.84 3.03 0 3.59 1.92 3.59 4.43V20h-2.96v-6.47c0-1.54-.03-3.53-2.18-3.53-2.18 0-2.52 1.66-2.52 3.41V20H8.3V8.5Z" />
    </svg>
  );
}

export const icons = {
  github: (className) => <GitHubIcon className={className} />,
  linkedin: (className) => <LinkedInIcon className={className} />,
  mail: (className) => <Mail className={className} />,
} satisfies Record<string, (className: string) => React.ReactElement>;

export type IconName = keyof typeof icons;
