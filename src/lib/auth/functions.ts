import { createServerFn } from "@tanstack/react-start";
import { getAdminSecretHash } from "./admin-secret";

export const createAdminSetupLink = createServerFn({ method: "POST" }).handler(
  async () => {
    if (!import.meta.env.VITE_ENABLE_ADMIN_SETUP) {
      return { success: false, error: "Admin setup is not enabled" };
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
);
