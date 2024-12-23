"use server";

import { extractCookieToken } from "@app/_utils/network";
import MongoPermissionRepository from "@lib/repositories/MongoPermissionRepository";
import MongoUserRepository from "@lib/repositories/MongoUserRepository";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { redirect, RedirectType } from "next/navigation";

export const userPermissionAction = async () => {
  try {
    const { userId } = await extractCookieToken();
    if (!userId) throw new BaseError("User not found");

    const user = await MongoUserRepository.getUser(userId);
    if (!user) throw new BaseError("User not found");

    const { permissionId } = user;
    if (!permissionId) throw new BaseError("Permission not found");

    const permission = await MongoPermissionRepository.getPermission(permissionId);
    if (!permission) throw new BaseError("Permission not found");

    const { rules = [] } = permission;
    return rules;
  } catch (error) {
    redirect("/auth/sign-in", "replace" as RedirectType);
  }
};
