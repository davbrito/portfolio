import { checkBotId } from "botid/server";

export async function isBot(): Promise<boolean> {
  if (import.meta.env.DEV) return false;

  const validation = await checkBotId();

  if (validation.isBot) {
    console.error("BotID validation failed: %O", validation);
  }

  return validation.isBot;
}
