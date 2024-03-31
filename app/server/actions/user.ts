"use server";

import { verifyJwt } from "@app/_utils/network";
import UserService from "@lib/services/UserService";
import { JWTPayload } from "@lib/shared/interfaces/jwt";
import { Resource, ResourcePermission } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import { cookies } from "next/headers";

type PermissionResource = ResourcePermission & { Resource: Resource };

export const getUserResources = async (): Promise<Set<string>> => {
  const { userId }: JWTPayload = await verifyJwt(cookies().get("jwt")?.value);
  const user = await UserService.getUserById(userId);
  if (!user) return new Set();

  const queryResources = await prismaClient.resourcePermission.findMany({
    where: { permissionId: user.permissionId as number },
    select: { Resource: true },
  });

  const resources = new Set((queryResources as Array<PermissionResource>).map(({ Resource }) => Resource.name));
  return resources;
};
