import { createMiddleware } from "@tanstack/react-start";
import { isBot } from "./validation";

export const botIdMiddleware = createMiddleware().server(async ({ next }) => {
  if (await isBot()) {
    throw new Error("Access denied: BotID validation failed");
  }

  return next();
});
