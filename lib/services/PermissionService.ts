import prismaClient from "@prismaClient/prismaClient";

class PermissionService {
  static #instance: PermissionService;

  static makeInstance() {
    return PermissionService.#instance ?? new PermissionService();
  }
  async getPermissions() {
    return prismaClient.permission.findMany();
  }
}
export default PermissionService.makeInstance();
