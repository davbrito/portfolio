import { Mail } from "lucide-react";

type IconProps = {
  className: string;
};

/**
 * Marca oficial de GitHub (Invertocat), tomada de `@primer/octicons`
 * (`mark-github-16`), el paquete que publica GitHub con los iconos de su
 * propio producto. No se altera la forma: solo hereda el color del texto.
 */
function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
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
