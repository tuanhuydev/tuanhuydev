import LogService from "./LogService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import prismaClient from "@prismaClient/prismaClient";

class TaskService {
  static #instance: TaskService;
  #defaultInclude: ObjectType = {
    status: true,
    assignee: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    createdBy: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };
  #defaultOrderBy: ObjectType = {
    createdAt: "desc",
  };

  static makeInstance() {
    return TaskService.#instance ?? new TaskService();
  }

  async createTask({ projectId, statusId, assigneeId, createdById, ...restData }: ObjectType) {
    let body: ObjectType = restData;
    if (projectId) {
      body = { ...body, project: { connect: { id: projectId } } };
    }
    if (statusId) {
      body = { ...body, status: { connect: { id: statusId } } };
    }
    if (assigneeId) {
      body = { ...body, assignee: { connect: { id: assigneeId } } };
    }
    if (createdById) {
      body = { ...body, createdBy: { connect: { id: createdById } } };
    }

    return await prismaClient.task.create({ data: body as any });
  }

  async getTasks(filter?: FilterType) {
    try {
      let defaultWhere: ObjectType = { deletedAt: null };
      if (!filter)
        return await prismaClient.task.findMany({
          where: defaultWhere,
          include: this.#defaultInclude,
          orderBy: this.#defaultOrderBy,
        });

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
      if ("userId" in filter) {
        defaultWhere = {
          ...defaultWhere,
          OR: [{ assigneeId: filter.userId }, { createdBy: { id: filter.userId } }],
        };
      }
      let query: any = {
        where: defaultWhere,
        include: this.#defaultInclude,
        orderBy: orderBy.map((order) => ({
          ...this.#defaultOrderBy,
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
      return await prismaClient.task.findFirst({
        where: { deletedAt: null, id: parseInt(id, 10) },
        include: this.#defaultInclude,
      });
    } catch (error) {
      LogService.log((error as Error).message);
      throw new BaseError((error as Error).message);
    }
  }

  async getTasksByProjectId(projectId: number) {
    try {
      return await prismaClient.task.findMany({
        where: { deletedAt: null, projectId },
        include: this.#defaultInclude,
        orderBy: this.#defaultOrderBy,
      });
    } catch (error) {
      LogService.log((error as Error).message);
      throw new BaseError((error as Error).message);
    }
  }

  async updateTask(id: number, data: ObjectType) {
    const { statusId, assigneeId, projectId, sprintId, createdById, ...restData } = data;

    const bodyToUpdate: ObjectType = {
      where: { id },
      data: {
        ...restData,
        status: { connect: { id: statusId } },
        project: projectId ? { connect: { id: projectId } } : { disconnect: true },
        assignee: assigneeId ? { connect: { id: assigneeId } } : { disconnect: true },
      },
    };
    return await prismaClient.task.update(bodyToUpdate as any);
  }

  async deleteTask(id: number) {
    return await prismaClient.task.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

export default TaskService.makeInstance();
