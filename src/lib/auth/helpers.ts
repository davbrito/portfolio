import { ADMIN_EMAIL } from "../server-env";
import { verifyAdminToken } from "./admin-secret";

export function adminTokenCheck(token: string | null | undefined): token is string {
  return !!token && verifyAdminToken(token);
}

export function isAdminEmail(email: string): boolean {
  const allowedEmails = ADMIN_EMAIL.split(",").map((e) => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
}
