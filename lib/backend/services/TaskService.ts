import LogService from "./LogService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Task } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import { FilterType, ObjectType } from "@shared/interfaces/base";

export type CreateTaskBody = Pick<Task, "title" | "description"> & {
  projectId?: number | null;
};

class TaskService {
  static #instance: TaskService;

  static makeInstance() {
    return TaskService.#instance ?? new TaskService();
  }

  async createTask(data: CreateTaskBody) {
    return await prismaClient.task.create({ data });
  }

  async getTasks(filter?: FilterType) {
    try {
      let defaultWhere: ObjectType = { deletedAt: null };
      if (!filter) return await prismaClient.task.findMany({ where: defaultWhere });

      const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

      if (search) {
        defaultWhere = { ...defaultWhere, name: { startsWith: search, contains: search } };
      }
      if ("active" in filter) {
        defaultWhere = {
          ...defaultWhere,
          publishedAt: filter?.active ? { not: null } : null,
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
      } else if (pageSize) {
        query.take = pageSize;
      }

      return await prismaClient.task.findMany(query);
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async getTask(id: string) {
    try {
      return await prismaClient.task.findFirst({ where: { deletedAt: null, id: parseInt(id, 10) } });
    } catch (error) {
      LogService.log((error as Error).message);
      throw new BaseError((error as Error).message);
    }
  }

  async updateTask(id: number, data: ObjectType) {
    return await prismaClient.task.update({ where: { id }, data });
  }

  async deleteTask(id: number) {
    return await prismaClient.task.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export default TaskService.makeInstance();
