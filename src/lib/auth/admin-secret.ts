import { createHash, timingSafeEqual } from "node:crypto";
import { ADMIN_SECRET } from "../server-env";

export function getAdminSecretHash() {
  const secret = ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET env variable is not set");
  }
  return createHash("sha256").update(secret).digest("hex");
}

export function verifyAdminToken(token: string) {
  const expected = getAdminSecretHash();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  if (tokenBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(tokenBuffer, expectedBuffer);
}
