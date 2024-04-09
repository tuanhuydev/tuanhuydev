import LogService from "./LogService";
import TaskService from "./TaskService";
import { verifyJwt } from "@app/_utils/network";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { Project, User } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import { cookies } from "next/headers";

export type CreateProjectBody = Pick<Project, "name" | "description" | "thumbnail"> & {
  users: ObjectType[];
};

class ProjectService {
  static #instance: ProjectService;

  static makeSingleton() {
    if (ProjectService.#instance) {
      return ProjectService.#instance;
    }
    return new ProjectService();
  }

  async createProject({ users = [], ...restBody }: CreateProjectBody) {
    const project: Project = await prismaClient.project.create({ data: restBody });
    if (users?.length) {
      const projectUsers = users.map(({ label, value }: ObjectType) => ({
        projectId: project.id,
        userId: value,
        roleId: 1,
      }));
      await prismaClient.projectUser.createMany({ data: projectUsers });
    }
    return project;
  }

  async getProjects(filter?: FilterType) {
    try {
      let defaultWhere: ObjectType = { deletedAt: null };
      if (!filter)
        return await prismaClient.project.findMany({
          where: defaultWhere,
          include: {
            users: true,
          },
        });

      const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

      if (search) {
        defaultWhere = {
          ...defaultWhere,
          name: { startsWith: search, contains: search },
        };
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
          users: { some: { userId: filter?.userId } },
        };
      }
      let query: any = {
        where: defaultWhere,
        include: {
          users: {
            select: {
              userId: true,
              roleId: true,
            },
          },
        },
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

      return await prismaClient.project.findMany(query);
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async getProject(id: string) {
    try {
      const project = await prismaClient.project.findFirst({
        where: { deletedAt: null, id: parseInt(id, 10) },
        include: {
          users: {
            select: {
              User: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
      const projectUsers = project?.users.map(({ User }: { User: Partial<User> }) => ({
        label: User.name,
        value: User.id,
      }));
      return { ...project, users: projectUsers };
    } catch (error) {
      LogService.log((error as Error).message);
      throw new BaseError((error as Error).message);
    }
  }

  async updateProject(id: number, data: ObjectType) {
    const { users = [], ...restData } = data;

    const updatedProject = await prismaClient.project.update({ where: { id }, data: restData });

    const currentUserProject = await prismaClient.projectUser.findMany({
      where: { projectId: id },
    });

    const deletedUsers = currentUserProject.filter(
      ({ userId: currentUserId }: ObjectType) => !users.find(({ value }: ObjectType) => value === currentUserId),
    );

    const transaction = [];

    if (deletedUsers.length) {
      transaction.push(
        prismaClient.projectUser.deleteMany({
          where: {
            projectId: id,
            userId: {
              in: deletedUsers.map(({ userId }: ObjectType) => userId),
            },
          },
        }),
      );
    }

    users.forEach(({ value: userId }: ObjectType) => {
      const isExist = currentUserProject.find(({ userId: currentUserId }: ObjectType) => currentUserId === userId);
      if (!isExist) {
        transaction.push(
          prismaClient.projectUser.create({
            data: { projectId: id, userId, roleId: 1 }, // TODO: get roleId from request
          }),
        );
      }
    });

    await prismaClient.$transaction(transaction);

    return updatedProject;
  }

  async deleteProject(id: number) {
    return await prismaClient.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getProjectTasks(projectId: number, params: ObjectType = {}) {
    const projectTasks = await TaskService.getTasksByProjectId(projectId, params);
    return projectTasks;
  }

  async getProjectUsers(projectId: number) {
    const projectUsers = await prismaClient.projectUser.findMany({
      where: { projectId },
      include: {
        User: true,
      },
    });

    if (!projectUsers.length) return [];
    return projectUsers.map(({ User }: { User: User }) => User);
  }

  async getProjectsByUser(userId: string) {
    const projects = await prismaClient.project.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
    });
    return projects;
  }
}

export default ProjectService.makeSingleton();
