import { createMiddleware } from "@tanstack/react-start";
import { checkBotId } from "botid/server";

export const botIdMiddleware = createMiddleware().server(async ({ next }) => {
  const validation = await checkBotId();

  if (validation.isBot) {
    console.error("BotID validation failed: %O", validation);
    throw new Error("Access denied: BotID validation failed");
  }

  return next();
});
