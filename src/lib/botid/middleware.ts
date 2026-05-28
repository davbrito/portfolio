import { createMiddleware } from "@tanstack/react-start";
import { validateBotId } from "./validation";

export const botIdMiddleware = createMiddleware().server(async ({ next }) => {
  await validateBotId();

  return next();
});
