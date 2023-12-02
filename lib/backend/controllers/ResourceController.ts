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
