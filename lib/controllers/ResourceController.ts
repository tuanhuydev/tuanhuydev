import { extractBearerToken } from "@app/_utils/network";
import Network from "@lib/shared/utils/network";
import prismaClient from "@prismaClient/prismaClient";
import BadRequestError from "@shared/commons/errors/BadRequestError";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest } from "next/server";

export class ResourceController {
  static #instance: ResourceController;

  static makeInstance() {
    return ResourceController.#instance ?? new ResourceController();
  }

  constructor() {}

  async getResource(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const resourceById = id === "me";
      if (resourceById) {
        const { userId } = await extractBearerToken(request);
        const user = await prismaClient.user.findUnique({ where: { id: userId } });
        if (!user) throw new BaseError("User not found");

        const { permissionId } = user;

        const rawResult = await prismaClient.resourcePermission.findMany({
          where: { permissionId },
          select: { Resource: true, permissionId: true, resourceType: true },
        });
        const resourcePermission = rawResult.map(({ Resource, resourceType }) => ({ ...Resource, resourceType }));

        if (!resourcePermission) throw new BaseError("Resource not found");
        return network.successResponse(resourcePermission);
      }

      const resource = await prismaClient.resource.findUnique({ where: { id: parseInt(id, 10) } });
      if (!resource) throw new BaseError("Resource not found");

      return network.successResponse(resource);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getResourcesByPermission(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const rawResult = await prismaClient.resourcePermission.findMany({
        where: {
          permissionId: parseInt(id, 10),
        },
        select: {
          Resource: true,
          permissionId: true,
          resourceType: true,
        },
      });
      const resourcePermission = rawResult.map(({ Resource, resourceType }) => ({ ...Resource, resourceType }));
      return network.successResponse(resourcePermission);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default ResourceController.makeInstance();
