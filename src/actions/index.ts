import { getAdminSecretHash } from "@/lib/auth/admin-secret";
import { createServerFn } from "@tanstack/react-start";

export { contactFormAction, deleteMessageAction, listMessagesAction, markReadMessageAction } from "./contact";
export { getProfileAction, revalidateProfileAction, upsertProfileAction } from "./profile";

export const generateAdminSetupTokenAction = createServerFn({ method: "POST" }).handler(() => {
  if (!import.meta.env.ENABLE_ADMIN_SETUP) {
    throw new Error("Admin setup is not enabled");
  }

  const token = getAdminSecretHash();

  console.log("Token para creción de usuario admin:", token);

  return { success: true };
});
