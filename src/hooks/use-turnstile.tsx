import { CF_TURNSTILE_SITE_KEY } from "#/config.ts";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useCallback, useRef, useState } from "react";

/**
 * Renders the existing managed Turnstile widget (site key CF_TURNSTILE_SITE_KEY) only once
 * `getToken` is first called. Most visitors resolve silently, but Cloudflare may require an
 * interactive challenge, tracked via `needsInteraction` so the caller can surface it (e.g. in
 * a popup) instead of leaving it floating invisibly in the layout.
 */
export function useTurnstile() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<TurnstileInstance>(null);
  const readyRef = useRef<(() => void) | null>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const getToken = useCallback(async () => {
    if (!ref.current) {
      await new Promise<void>((resolve) => {
        readyRef.current = resolve;
        setMounted(true);
      });
    } else {
      // Tokens are single-use: get a fresh one on every subsequent call.
      ref.current.reset();
    }

    return ref.current!.getResponsePromise();
  }, []);

  const widget = mounted ? (
    <Turnstile
      ref={ref}
      siteKey={CF_TURNSTILE_SITE_KEY}
      options={{ size: "invisible", appearance: "interaction-only", execution: "render" }}
      onWidgetLoad={() => readyRef.current?.()}
      onError={() => ref.current?.reset()}
      onExpire={() => ref.current?.reset()}
      onBeforeInteractive={() => setNeedsInteraction(true)}
      onAfterInteractive={() => setNeedsInteraction(false)}
    />
  ) : null;

  return { widget, getToken, needsInteraction };
}
