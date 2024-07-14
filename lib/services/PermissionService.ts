class PermissionService {
  static #instance: PermissionService;

  static makeInstance() {
    return PermissionService.#instance ?? new PermissionService();
  }
}
export default PermissionService.makeInstance();
