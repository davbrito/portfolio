import { CF_TURNSTILE_SITE_KEY } from "#/config.ts";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useRef, useState } from "react";

/**
 * Runs the existing managed Turnstile widget (site key CF_TURNSTILE_SITE_KEY) with
 * `appearance: "interaction-only"`: it resolves silently for most visitors, and only
 * renders a visible challenge (tracked via `needsInteraction`) when Cloudflare decides
 * the traffic is risky enough to require it.
 */
export function useInvisibleTurnstile() {
  const ref = useRef<TurnstileInstance>(null);
  const resolveRef = useRef<((token: string) => void) | null>(null);
  const rejectRef = useRef<((error: Error) => void) | null>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const getToken = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
      ref.current?.execute();
    });
  }, []);

  const widget = (
    <Turnstile
      ref={ref}
      siteKey={CF_TURNSTILE_SITE_KEY}
      options={{ size: "invisible", appearance: "interaction-only", execution: "execute" }}
      onSuccess={(token) => resolveRef.current?.(token)}
      onError={() => {
        rejectRef.current?.(new Error("No se pudo completar la verificación de seguridad."));
        ref.current?.reset();
      }}
      onExpire={() => ref.current?.reset()}
      onBeforeInteractive={() => setNeedsInteraction(true)}
      onAfterInteractive={() => setNeedsInteraction(false)}
    />
  );

  return { widget, getToken, needsInteraction };
}
