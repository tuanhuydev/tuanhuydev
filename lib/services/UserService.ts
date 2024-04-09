import { verifyJwt } from "@app/_utils/network";
import NotFoundError from "@lib/shared/commons/errors/NotFoundError";
import { User } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import BaseError from "@shared/commons/errors/BaseError";
import { cookies } from "next/headers";

export type UserFilter = {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: ObjectType[];
};

class UserService {
  static #instance: UserService;

  static makeSingleton() {
    if (UserService.#instance) {
      return UserService.#instance;
    }
    return new UserService();
  }

  exlude(user: User, fields: string[]) {
    const userEntries = Object.entries(user).filter(([key]) => !fields.includes(key));
    return Object.fromEntries(userEntries);
  }

  async createUser(body: ObjectType) {
    delete body.confirmPassword;
    try {
      const existingUser = await prismaClient.user.findFirst({ where: { email: body.email } });
      if (existingUser) throw new BaseError("User already existed");
      const { permission, project, ...userBody } = body;
      return prismaClient.$transaction(async (tx) => {
        const user = await prismaClient.user.create({ data: userBody as any });
        if (project?.length) {
          for (const projectId of project) {
            await tx.projectUser.create({ data: { userId: user.id, projectId, roleId: 1 } });
          }
        }
      });
    } catch (error: any) {
      throw new BaseError((error as Error).message);
    }
  }

  async getUsers(filter?: UserFilter) {
    let defaultWhere: ObjectType = { deletedAt: null };
    if (!filter) return await prismaClient.user.findMany({ where: defaultWhere });
    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;
    if (search) {
      defaultWhere = {
        ...defaultWhere,
        OR: [
          {
            name: { contains: search },
          },
          {
            email: { contains: search },
          },
        ],
      };
    }
    let query: any = {
      where: defaultWhere,
      orderBy: orderBy.map((order) => ({
        [order.field]: order.direction.toLowerCase(),
      })),
    };

    if (page && pageSize) {
      query.take = pageSize;
      query.skip = (page - 1) * pageSize;
    }

    try {
      const users = await prismaClient.user.findMany(query);
      const userWithoutPasswords = users.map((user: User) => this.exlude(user, ["password"]));
      return userWithoutPasswords;
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: { id, deletedAt: null },
      });
      if (!user) throw new NotFoundError("User not found");
      return this.exlude(user, ["password"]);
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async updateUser(id: string, data: Object) {
    try {
      if (!id || !data) throw new BaseError();
      return await prismaClient.user.update({ where: { id }, data });
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async deleteUser(id: string) {
    try {
      if (!id) throw new BaseError();
      return await prismaClient.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }
}

export default UserService.makeSingleton();
