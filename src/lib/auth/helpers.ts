import { verifyAdminToken } from "./admin-secret";

export function adminTokenCheck(
  token: string | null | undefined,
): token is string {
  return !!token && verifyAdminToken(token);
}
