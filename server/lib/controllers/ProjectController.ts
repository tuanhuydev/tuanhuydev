import LogService from "../services/LogService";
import { extractBearerToken } from "@app/_utils/network";
import MongoProjectRepository from "@lib/repositories/MongoProjectRepository";
import MongoSprintRepository from "@lib/repositories/MongoSprintRepository";
import MongoTaskRepository from "@lib/repositories/MongoTaskRepository";
import BadRequestError from "@lib/shared/commons/errors/BadRequestError";
import BaseError from "@lib/shared/commons/errors/BaseError";
import NotFoundError from "@lib/shared/commons/errors/NotFoundError";
import { BaseController } from "@lib/shared/interfaces/controller";
import Network from "@lib/shared/utils/network";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { z } from "zod";

export class ProjectController implements BaseController {
  static #instance: ProjectController;

  static makeInstance() {
    return ProjectController.#instance ?? new ProjectController();
  }

  async store(request: NextRequest) {
    const network = Network(request);
    try {
      const schema = z.object({
        name: z.string(),
        clientName: z.string(),
        description: z.string(),
        startDate: z
          .string()
          .refine(
            (value) => {
              const date = new Date(value);
              return !isNaN(date.getTime());
            },
            {
              message: "Invalid start date",
            },
          )
          .transform((value) => new Date(value).toISOString()),
        endDate: z.string().refine(
          (value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
          },
          {
            message: "Invalid end date",
          },
        ),
        users: z.array(z.string().transform((value) => new ObjectId(value))).default([]),
      });

      const body = await network.getBody();
      const validatedBody = schema.safeParse(body);

      if (!validatedBody.success) throw new BadRequestError("Inavlid request body");

      const newProject = await MongoProjectRepository.createProject(body);
      return network.successResponse(newProject);
    } catch (error) {
      console.log(error);
      LogService.log((error as Error).message);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest, userId?: string) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();
      if (userId) params.userId = userId;
      const projects = await MongoProjectRepository.getProjects(params);

      return network.successResponse(projects);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const projectById = await MongoProjectRepository.getProject(id);
      return network.successResponse(projectById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const body = await network.getBody();
      if (!id || !body) throw new BadRequestError();

      const updated = await MongoProjectRepository.updateProject(id, body);
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: any) {
    if (!id) throw new BadRequestError();
    const network = Network(request);
    try {
      // const deleted = await ProjectService.deleteProject(Number(id));
      // return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getProjectTasks(request: NextRequest, { id }: any) {
    const network = Network(request);
    const filter = network.extractSearchParams();
    try {
      if (!id) throw new BadRequestError();
      const projectTasks = await MongoTaskRepository.getTasksByProject(id, filter);
      return network.successResponse(projectTasks);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getProjectUsers(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const project = await MongoProjectRepository.getProject(id);
      if (!project) throw new NotFoundError("Project not found");
      const { users = [] } = project;
      return network.successResponse(users);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getProjectsByUser(request: NextRequest, { id }: any) {
    const network = Network(request);
    let userId = id;
    try {
      if (!id) throw new BadRequestError();
      if (id === "me") {
        const { userId: currentUserId } = await extractBearerToken(request);
        userId = currentUserId;
      }
      return this.getAll(request, userId);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getActiveSprint(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const sprint = await MongoSprintRepository.getSprints({ projectId: id, active: true });
      if (!sprint) throw new NotFoundError("sprint not found");
      return network.successResponse(sprint[0]);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default ProjectController.makeInstance();
