import { CF_TURNSTILE_SITE_KEY } from "#/config.ts";
import { Turnstile, type AppearanceMode, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";

interface UseTurnstileOptions {
  appearance?: AppearanceMode;
  /** Called every time the widget resolves a token (including automatically, on mount/reset). */
  onSuccess?: (token: string) => void;
  /** Called when the widget fails to validate (network error or challenge failure). */
  onError?: () => void;
}

export function useTurnstile({ onSuccess, onError, appearance }: UseTurnstileOptions = {}) {
  const ref = useRef<TurnstileInstance>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const getToken = async () => {
    return ref.current!.getResponsePromise();
  };

  const reset = () => ref.current?.reset();

  const widget = (
    <Turnstile
      ref={ref}
      siteKey={CF_TURNSTILE_SITE_KEY}
      onSuccess={onSuccess}
      onError={(error) => {
        console.warn("Turnstile widget error:", error);
        ref.current?.reset();
        onError?.();
      }}
      options={{ appearance }}
      onExpire={() => {
        console.warn("Turnstile token expired");
        ref.current?.reset();
      }}
      onBeforeInteractive={() => setNeedsInteraction(true)}
      onAfterInteractive={() => setNeedsInteraction(false)}
    />
  );

  return { widget, getToken, reset, needsInteraction };
}
