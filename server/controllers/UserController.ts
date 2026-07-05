import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import NotFoundError from "@lib/commons/errors/NotFoundError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { CreateUserDTO } from "@server/dto/user.dto";
import { User } from "@server/models/User";
import { userRepository } from "@server/repositories/MongoUserRepository";
import { authService } from "@server/services/AuthService";
import { logService } from "@server/services/LogService";
import Network from "@server/utils/network";
import { NextRequest } from "next/server";
import { z } from "zod";

function omitPassword(doc: Record<string, unknown>): Record<string, unknown> {
  const { password: _password, ...rest } = doc;
  return rest;
}

export class UserController {
  static #instance: UserController;

  static makeInstance() {
    return UserController.#instance ?? new UserController();
  }

  async validateStore(body: unknown) {
    try {
      const schema = z
        .object({
          name: z.string().max(50),
          email: z.string().max(50),
          password: z.string(),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirm"],
        });

      return schema.parseAsync(body);
    } catch {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest) {
    const network = new Network(request);
    const body = await network.getBody();
    try {
      // Bootstrap exception: the very first account may be created without a
      // session (otherwise nobody could ever create the initial admin user,
      // since there is no seed script). Once any user exists, registration
      // requires an authenticated session.
      const existingUsers = await userRepository.findAll({ pageSize: 1 });
      if (existingUsers.length > 0) {
        const currentUser = await authService.getCurrentUserProfile();
        if (!currentUser) throw new UnauthorizedError("Unauthenticated user");
      }

      const { password, ...restBody }: Record<string, unknown> = await this.validateStore(body);

      delete restBody.confirmPassword;
      const hashPassword = await authService.hashPassword(password as string);

      const newUser = await userRepository.create({
        ...restBody,
        password: hashPassword,
      } as CreateUserDTO);

      return network.successResponse(newUser);
    } catch (error) {
      logService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const params: Record<string, unknown> = network.extractSearchParams();

      const users = await userRepository.findAll(params);
      return network.successResponse(users.map(omitPassword));
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const CURRENT_USER_KEY: string = "me";
      const userId: string = id === CURRENT_USER_KEY ? currentUser.id : id;

      const userById: User | null = (await userRepository.findOne(userId)) as User | null;
      if (!userById) throw new NotFoundError("User not found");

      return network.successResponse(omitPassword(userById));
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as Record<string, unknown>;
    if (!id || !body) throw new BadRequestError();
    const network = new Network(request);
    try {
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const user = await userRepository.findOne(id);
      if (!user) throw new NotFoundError("User not found");

      return network.successResponse(omitPassword(user));
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest) {
    const network = new Network(request);
    try {
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      return network.successResponse({ message: "Not implemented" });
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export const userController = UserController.makeInstance();
