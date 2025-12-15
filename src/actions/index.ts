import { getAdminSecretHash } from "@/lib/auth/admin-secret";
import { ActionError, defineAction } from "astro:actions";
import { contactFormAction } from "./contact";
import { profileActions } from "./profile";

export const server = {
  profile: profileActions,
  admin: {
    setupLink: defineAction({
      handler() {
        if (!import.meta.env.ENABLE_ADMIN_SETUP) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "Admin setup is not enabled",
          });
        }

        const hash = getAdminSecretHash();
        const url = `http://localhost:3000/admin/setup?token=${hash}`;
        console.log(
          "----------------------------------------\n" +
            "ADMIN SETUP LINK:\n" +
            url +
            "\n" +
            "----------------------------------------",
        );
        return { success: true };
      },
    }),
  },
  contactForm: contactFormAction,
};
