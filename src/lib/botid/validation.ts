import { checkBotId } from "botid/server";

export async function validateBotId() {
  const validation = await checkBotId();

  if (validation.isBot) {
    console.error("BotID validation failed: %O", validation);
    throw new Error("Access denied: BotID validation failed");
  }

  return validation;
}
