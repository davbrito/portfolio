import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const trueFn = () => true;
const isPasskeysSupported = () =>
  typeof window !== "undefined" &&
  window.PublicKeyCredential !== undefined &&
  typeof window.PublicKeyCredential === "function";

export function useIsPasskeysSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, isPasskeysSupported, trueFn);
}
