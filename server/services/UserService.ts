export class UserService {
  static #instance: UserService;

  static getInstance() {
    return this.#instance ?? new UserService();
  }
}

export const userService = UserService.getInstance();
