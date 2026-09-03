import { CF_TURNSTILE_SITE_KEY } from "#/config.ts";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useRef } from "react";

/**
 * Runs the existing managed Turnstile widget (site key CF_TURNSTILE_SITE_KEY) in
 * invisible/non-interactive mode: it only surfaces a challenge UI if Cloudflare
 * decides one is required, otherwise it resolves silently.
 */
export function useInvisibleTurnstile() {
  const ref = useRef<TurnstileInstance>(null);
  const resolveRef = useRef<((token: string) => void) | null>(null);
  const rejectRef = useRef<((error: Error) => void) | null>(null);

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
    />
  );

  return { widget, getToken };
}
