import { getAdminSecretHash } from "@/lib/auth/admin-secret";
import { ActionError, defineAction } from "astro:actions";
import { contactFormAction, messagesActions } from "./contact";
import { profileActions } from "./profile";

export const server = {
  profile: profileActions,
  messages: messagesActions,
  admin: {
    generateAdminSetupToken: defineAction({
      handler() {
        if (!import.meta.env.ENABLE_ADMIN_SETUP) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Admin setup is not enabled",
          });
        }

        const token = getAdminSecretHash();

        console.log("Token para creción de usuario admin:", token);

        return { success: true };
      },
    }),
  },
  contactForm: contactFormAction,
};
