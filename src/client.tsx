import { StartClient } from "@tanstack/react-start/client";
import { initBotId } from "botid/client/core";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
);

if (!import.meta.env.DEV) {
  initBotId({
    protect: [
      { path: "/_serverFn/*", method: "POST" },
      { path: "/curriculum.pdf", method: "GET" },
    ],
  });
}
