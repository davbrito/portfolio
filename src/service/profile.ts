import { db } from "@/lib/db";
import type { ProfileModel } from "@prisma-generated/models";

export async function findProfile(
  userId: string,
): Promise<ProfileModel | null> {
  const profile = await db.profile.findUnique({
    where: { userId },
  });

  return profile;
}

export async function upsertProfile(
  userId: string,
  data: Omit<ProfileModel, "userId">,
): Promise<ProfileModel> {
  console.log("data received for upsertProfile:", userId);
  const profile = await db.profile.upsert({
    where: { userId },
    update: {
      ...data,
    },
    create: {
      ...data,
      user: { connect: { id: userId } },
    },
  });

  return profile;
}
