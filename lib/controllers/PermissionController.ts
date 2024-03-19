import PermissionService from "@lib/services/PermissionService";
import postService from "@lib/services/PostService";
import { BaseController } from "@lib/shared/interfaces/controller";
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
      const permissions = await PermissionService.getPermissions();
      return network.successResponse(permissions);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const postById = await postService.getPost(id);
      return network.successResponse(postById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default PermissionController.makeInstance();
