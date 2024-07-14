import { extractBearerToken } from "@app/_utils/network";
import MongoPermissionRepository from "@lib/repositories/MongoPermissionRepository";
import MongoUserRepository from "@lib/repositories/MongoUserRepository";
import Network from "@lib/shared/utils/network";
import BadRequestError from "@shared/commons/errors/BadRequestError";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest } from "next/server";

export class PermissionController {
  static #instance: PermissionController;

  static makeInstance() {
    return PermissionController.#instance ?? new PermissionController();
  }
  async getAll(request: NextRequest) {
    const network = Network(request);
    try {
      const permissions = await MongoPermissionRepository.getPermissions();
      return network.successResponse(permissions);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      let userId = id;
      if (id === "me") {
        const { userId: currentUserId } = await extractBearerToken(request);
        userId = currentUserId;
      }
      const user = await MongoUserRepository.getUser(userId);
      if (!user) throw new BaseError("User not found");

      const { permissionId } = user;
      if (!permissionId) throw new BaseError("Permission not found");

      const permission = await MongoPermissionRepository.getPermission(permissionId);
      return network.successResponse(permission);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async store(request: NextRequest) {}
}

export default PermissionController.makeInstance();
