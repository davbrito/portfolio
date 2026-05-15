import { createHash, timingSafeEqual } from "node:crypto";
import { ADMIN_SECRET } from "../server-env";
import { createServerOnlyFn } from "@tanstack/react-start";

export const getAdminSecretHash = createServerOnlyFn(() => {
  const secret = ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET env variable is not set");
  }
  return createHash("sha256").update(secret).digest("hex");
});

export const verifyAdminToken = createServerOnlyFn((token: string) => {
  const expected = getAdminSecretHash();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  if (tokenBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(tokenBuffer, expectedBuffer);
});
