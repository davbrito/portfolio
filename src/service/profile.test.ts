import { describe, expect, it } from "vitest";
import { findProfile, getProfileFromStorage } from "./profile";

describe("profile service with storage", () => {
  it("loads profile from storage", async () => {
    const stored = await getProfileFromStorage();
    expect(stored).not.toBeNull();
    expect(stored?.name).toBe("David Brito");
    expect(stored?.title).toBe("Full-Stack Developer");
    expect(stored?.aboutImage).toBe("/profile/assets/profile-about-image.jpeg");
    expect(stored?.projects.length).toBeGreaterThan(0);
    expect(stored?.projects[0].image).toBe("/profile/assets/project-tasa-de-cambio-venezuela-image.webp");
    expect(stored?.projects[1].image).toBe("/profile/assets/project-minurl-image.webp");
  });

  it("findProfile adapts storage data for portfolio view", async () => {
    const profile = await findProfile();
    expect(profile).not.toBeNull();
    expect(profile?.name).toBe("David Brito");
    expect(profile?.userId).toBe("pK8CKPrIWIq5GIW8ENd1C6Ytlk6AY1eM");
    expect(profile?.proyects.length).toBeGreaterThan(0);
    expect(profile?.skills.length).toBe(18);
    expect(profile?.experiences.length).toBe(1);
  });
});
