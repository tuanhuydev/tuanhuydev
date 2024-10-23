import AuthService from "../services/AuthService";
import { extractBearerToken } from "@app/_utils/network";
import MongoPermissionRepository from "@lib/repositories/MongoPermissionRepository";
import MongoUserPermissionRepository from "@lib/repositories/MongoUserPermissionRepository";
import MongoUserRepository from "@lib/repositories/MongoUserRepository";
import LogService from "@lib/services/LogService";
import BadRequestError from "@lib/shared/commons/errors/BadRequestError";
import BaseError from "@lib/shared/commons/errors/BaseError";
import NotFoundError from "@lib/shared/commons/errors/NotFoundError";
import { BaseController } from "@lib/shared/interfaces/controller";
import Network from "@lib/shared/utils/network";
import { NextRequest } from "next/server";
import { z } from "zod";

class UserController implements BaseController {
  static #instance: UserController;

  static makeInstance() {
    return UserController.#instance ?? new UserController();
  }

  async validateStore(body: any) {
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
    } catch (error) {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest, params: any) {
    const network = Network(request);
    const body = await network.getBody();
    try {
      const { password, permissionIds, roleId, ...restBody }: ObjectType = await this.validateStore(body);

      // Password processing
      delete restBody.confirmPassword;
      const hashPassword = await AuthService.hashPassword(password);

      // Create user
      const newUser = await MongoUserRepository.createUser({
        ...restBody,
        password: hashPassword,
      });
      // if has roleId then assign it to userRoles
      if (roleId) {
        // Assign user to role in userRoles
      }
      if (permissionIds?.length) {
        await Promise.all(
          permissionIds.map(async ({ rules }: any) => {
            //create then assign to user
            const permission = await MongoPermissionRepository.createPermission({ rules });
            if (!permission) throw new BaseError("Unable to create permission");

            await MongoUserPermissionRepository.createUserPermission({
              userId: newUser.insertedId,
              permissionId: permission.insertedId,
            });
          }),
        );
      }

      return network.successResponse(newUser);
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();

      const users = await MongoUserRepository.getUsers(params);
      return network.successResponse(users);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const CURRENT_USER_KEY: string = "me";
      let userId: string = id;
      if (id === CURRENT_USER_KEY) {
        const { userId: tokenUserId } = await extractBearerToken(request);
        userId = tokenUserId as string;
      }
      const userById = await MongoUserRepository.getUser(userId);
      return network.successResponse(userById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const body = await request.json();
    if (!id || !body) throw new BadRequestError();
    const network = Network(request);
    try {
      const { permissionIds, id, ...restBody }: ObjectType = body;

      const user = await MongoUserRepository.getUser(id);
      if (!user) throw new NotFoundError("User not found");

      // If there's existed permission, then create new permission
      if (permissionIds?.length) {
        await Promise.all(
          permissionIds.map(async ({ id, rules }: any) => {
            if (!id) {
              //create then assign to user
              const permission = await MongoPermissionRepository.createPermission({ rules });
              if (!permission) throw new BaseError("Unable to create permission");

              await MongoUserPermissionRepository.createUserPermission({
                userId: user._id,
                permissionId: permission.insertedId,
              });
            } else {
              await MongoPermissionRepository.updatePermission(id, { rules });
            }
          }),
        );
      }
      return network.successResponse(user);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: any) {
    // if (!id) throw new BadRequestError();
    // const network = Network(request);
    // try {
    //   return network.successResponse(deleted);
    // } catch (error) {
    //   return network.failResponse(error as BaseError);
    // }
  }

  async getUserPermissions(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      let userId: string = id;
      if (id === "me") {
        const { userId: tokenUserId } = await extractBearerToken(request);
        userId = tokenUserId as string;
      }

      const userPermissions = await MongoUserPermissionRepository.getUserPermissions(userId);
      return network.successResponse(userPermissions);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default UserController.makeInstance();
