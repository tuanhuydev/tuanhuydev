import AuthService from "../services/AuthService";
import { extractBearerToken } from "@app/_utils/network";
import MongoUserRepository from "@lib/repositories/MongoUserRepository";
import { BaseController } from "@lib/shared/interfaces/controller";
import Network from "@lib/shared/utils/network";
import BadRequestError from "@shared/commons/errors/BadRequestError";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest } from "next/server";
import { ObjectSchema, object, string } from "yup";
import { z } from "zod";

class UserController implements BaseController {
  static #instance: UserController;
  #schema: ObjectSchema<any>;

  static makeInstance() {
    return UserController.#instance ?? new UserController();
  }

  constructor() {
    this.#schema = object({
      name: string().max(50).required(),
      email: string().max(50).required(),
      password: string().required(),
    });
  }

  async validateStoreRequest(body: any) {
    try {
      return this.#schema.validate(body);
    } catch (error) {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest, params: any) {
    const network = Network(request);
    try {
      const schema = z
        .object({
          name: z.string().max(50),
          email: z.string().max(50),
          password: z.string(),
          confirmPassword: z.string(),
          permissionId: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ["confirm"],
        });
      const body = await network.getBody();
      const { confirmPassword, password, ...restBody }: ObjectType = await schema.parseAsync(body);

      const hashPassword = await AuthService.hashPassword(password);
      const newUser = await MongoUserRepository.createUser({
        ...restBody,
        password: hashPassword,
      });
      return network.successResponse(newUser);
    } catch (error) {
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
    // const body = await request.json();
    // if (!id || !body) throw new BadRequestError();
    // const network = Network(request);
    // try {
    // 	const updated = await userService.updatePost(Number(id), body);
    // 	return network.successResponse(updated);
    // } catch (error) {
    // 	return network.failResponse(error as BaseError);
    // }
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
}

export default UserController.makeInstance();
