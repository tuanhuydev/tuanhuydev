"use server";

import BaseError from "@lib/commons/errors/BaseError";
import { redirect, RedirectType } from "next/navigation";
import MongoPermissionRepository from "server/repositories/MongoPermissionRepository";
import MongoUserRepository from "server/repositories/MongoUserRepository";
import AuthService from "server/services/AuthService";

export const userPermissionAction = async () => {
  try {
    const userProfile = await AuthService.getCurrentUserProfile();
    if (!userProfile) throw new BaseError("User not found");

    const user = await MongoUserRepository.getUser(userProfile?.id);
    if (!user) throw new BaseError("User not found");

    const { permissionId } = user;
    if (!permissionId) throw new BaseError("Permission not found");

    const permission = await MongoPermissionRepository.getPermission(permissionId);
    if (!permission) throw new BaseError("Permission not found");

    const { rules = [] } = permission;
    return rules;
  } catch (error) {
    console.log(error);
    redirect("/auth/sign-in", "replace" as RedirectType);
  }
};
