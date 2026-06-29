import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import NotFoundError from "@lib/commons/errors/NotFoundError";
import Network from "@lib/utils/network";
import { CreateUserDTO } from "@server/dto/user.dto";
import { User } from "@server/models/User";
import { userRepository } from "@server/repositories/MongoUserRepository";
import { authService } from "@server/services/AuthService";
import { logService } from "@server/services/LogService";
import { NextRequest } from "next/server";
import { z } from "zod";

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
          roleId: z.string().optional(),
          permissionIds: z.array(
            z.object({
              rules: z.array(
                z.object({
                  type: z.string().min(1),
                  action: z.string().min(1),
                  resourceId: z.string().min(1),
                }),
              ),
            }),
          ),
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
      const { password, ...restBody }: Record<string, unknown> = await this.validateStore(body);

      // Password processing
      delete restBody.confirmPassword;
      const hashPassword = await authService.hashPassword(password as string);

      // Create user
      const newUser = await userRepository.create({
        ...restBody,
        password: hashPassword,
      } as CreateUserDTO);

      // if ((permissionIds as Array<Permission>)?.length) {
      //   await Promise.all(
      //     (permissionIds as Array<Permission>).map(async ({ rules }: Permission) => {
      //       //create then assign to user
      //       const permission = await permissionRepository.create({ rules });
      //       if (!permission) throw new BaseError("Unable to create permission");

      //       await userPermissionRepository.createUserPermission({
      //         userId: newUser.insertedId,
      //         permissionId: permission.insertedId,
      //       });
      //     }),
      //   );
      // }

      return network.successResponse(newUser);
    } catch (error) {
      logService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();

      const users = await userRepository.findAll(params);
      return network.successResponse(users);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();
      const CURRENT_USER_KEY: string = "me";
      let userId: string = id;
      if (id === CURRENT_USER_KEY) {
        const user: User | null = await authService.getCurrentUserProfile();
        if (!user) throw new NotFoundError("User not found");
        userId = user.id;
      }
      const userById = await userRepository.findOne(userId);
      if (!userById) throw new NotFoundError("User not found");
      delete userById.password;

      return network.successResponse(userById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as Record<string, unknown>;
    if (!id || !body) throw new BadRequestError();
    const network = new Network(request);
    try {
      const { id }: Record<string, unknown> = body;

      const user = await userRepository.findOne(id as string);
      if (!user) throw new NotFoundError("User not found");

      // If there's existed permission, then create new permission
      // if ((permissionIds as Array<Permission>)?.length) {
      //   await Promise.all(
      //     (permissionIds as Array<Permission>).map(async ({ id, rules }: Permission) => {
      //       if (!id) {
      //         //create then assign to user
      //         const permission = await permissionRepository.create({ rules });
      //         if (!permission) throw new BaseError("Unable to create permission");

      //         await userPermissionRepository.createUserPermission({
      //           userId: user._id,
      //           permissionId: permission.insertedId,
      //         });
      //       } else {
      //         await permissionRepository.save(id, { rules });
      //       }
      //     }),
      //   );
      // }
      return network.successResponse(user);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete() {}

  async getUserPermissions(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      // Permissions removed - return empty array for now
      const userPermissions: unknown[] = [];
      return network.successResponse(userPermissions);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export const userController = UserController.makeInstance();
