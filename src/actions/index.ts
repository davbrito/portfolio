import { getAdminSecretHash } from "@/lib/auth/admin-secret";
import { contactFormAction, messagesActions } from "./contact";
import { profileActions } from "./profile";
import { createServerFn } from "@tanstack/react-start";

export const actions = {
  profile: profileActions,
  messages: messagesActions,
  admin: {
    generateAdminSetupToken: createServerFn({ method: "POST" }).handler(() => {
      if (!import.meta.env.ENABLE_ADMIN_SETUP) {
        throw new Error("Admin setup is not enabled");
      }

      const token = getAdminSecretHash();

      console.log("Token para creción de usuario admin:", token);

      return { success: true };
    }),
  },
  contactForm: contactFormAction,
};
