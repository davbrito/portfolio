import { CF_TURNSTILE_SITE_KEY } from "#/config.ts";
import type { CaptchaRenderProps } from "@better-auth-ui/react/plugins/captcha";
import { type TurnstileInstance, Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef } from "react";

export function TurnstileWidget({ setToken, clearToken, setReset }: CaptchaRenderProps) {
  const ref = useRef<TurnstileInstance>(null);

  useEffect(() => {
    setReset(() => ref.current?.reset());
    return () => setReset(null);
  }, [setReset]);

  return (
    <Turnstile
      ref={ref}
      siteKey={CF_TURNSTILE_SITE_KEY}
      onSuccess={setToken}
      onError={clearToken}
      onExpire={clearToken}
      options={{ size: "flexible" }}
    />
  );
}
