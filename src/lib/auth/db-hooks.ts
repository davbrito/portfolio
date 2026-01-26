import { APIError, type GenericEndpointContext, type User } from "better-auth";
import { verifyAdminToken } from "./admin-secret";
import { isAdminEmail } from "./helpers";

export function validateUserCreation(user: User, context: GenericEndpointContext | null) {
  console.log("Creating user:", user);
  const token = context?.body?.adminToken || context?.request?.headers.get("x-admin-token");
  console.log("Creating user with admin token:", token);

  if (!token || !verifyAdminToken(token)) {
    throw new APIError("UNAUTHORIZED", {
      message: "Invalid admin token",
    });
  }

  if (!isAdminEmail(user.email)) {
    throw new APIError("UNAUTHORIZED", {
      message: "This email is not authorized to create an admin account",
    });
  }
}
