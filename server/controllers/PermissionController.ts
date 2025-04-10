import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import MongoPermissionRepository from "server/repositories/MongoPermissionRepository";
import MongoUserRepository from "server/repositories/MongoUserRepository";

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
        const test = cookies().get("user");
        console.log(test);
        // userId = currentUserId;
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
