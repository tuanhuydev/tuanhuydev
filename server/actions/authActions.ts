"use server";

import BaseError from "@lib/commons/errors/BaseError";
import { permissionRepository } from "@server/repositories/MongoPermissionRepository";
import { userRepository } from "@server/repositories/MongoUserRepository";
import { unstable_cache } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { authService } from "server/services/AuthService";
import { logService } from "server/services/LogService";

// Cache user permissions for 5 minutes to reduce database load
const getCachedUserPermissions = unstable_cache(
  async (userId: string) => {
    const user = await userRepository.findOne(userId);
    if (!user) throw new BaseError("User not found");

    const { permissionId } = user;
    if (!permissionId) throw new BaseError("Permission not found");

    const permission = await permissionRepository.findOne(permissionId as string);
    if (!permission) throw new BaseError("Permission not found");

    const { rules = [] } = permission;
    return rules as string[];
  },
  ["user-permissions"],
  {
    revalidate: 300, // 5 minutes cache
    tags: ["permissions"],
  },
);

export const userPermissionAction = async () => {
  try {
    const userProfile = await authService.getCurrentUserProfile();
    if (!userProfile) throw new BaseError("User not found");

    // Use cached version to improve performance
    return await getCachedUserPermissions(userProfile.id);
  } catch (error) {
    logService.log(error);
    redirect("/auth/sign-in", "replace" as RedirectType);
  }
};
