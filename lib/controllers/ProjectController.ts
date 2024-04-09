import LogService from "../services/LogService";
import ProjectService from "../services/ProjectService";
import { extractBearerToken } from "@app/_utils/network";
import { BaseController } from "@lib/shared/interfaces/controller";
import Network from "@lib/shared/utils/network";
import BadRequestError from "@shared/commons/errors/BadRequestError";
import BaseError from "@shared/commons/errors/BaseError";
import { NextRequest } from "next/server";
import { ObjectSchema, object, string, date, array, mixed } from "yup";

export class ProjectController implements BaseController {
  #schema: ObjectSchema<any>;
  static #instance: ProjectController;

  static makeInstance() {
    return ProjectController.#instance ?? new ProjectController();
  }

  constructor() {
    this.#schema = object({
      name: string().required(),
      description: string().required(),
      thumbnail: string().nullable(),
      startDate: date().nullable(),
      endDate: date().nullable(),
      users: array()
        .of(
          object({
            label: string(),
            value: mixed().nullable(),
          }),
        )
        .nullable(),
    });
  }

  async validateStoreRequest(body: any) {
    try {
      return this.#schema.validate(body);
    } catch (error) {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest) {
    const network = Network(request);
    try {
      const body = await request.json();
      const validatedBody = await this.validateStoreRequest(body);
      const newProject = await ProjectService.createProject(validatedBody);

      return network.successResponse(newProject);
    } catch (error) {
      LogService.log((error as Error).message);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();
      if ("userId" in params) {
        let userId = params.userId;
        if (userId === "me") {
          const { userId } = await extractBearerToken(request);
          params.userId = userId;
        }
      }
      const projects = await ProjectService.getProjects(params);

      return network.successResponse(projects);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const projectById = await ProjectService.getProject(id);
      return network.successResponse(projectById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const body = await request.json();
    if (!id || !body) throw new BadRequestError();

    const network = Network(request);
    try {
      const updated = await ProjectService.updateProject(Number(id), body);
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: any) {
    if (!id) throw new BadRequestError();
    const network = Network(request);
    try {
      const deleted = await ProjectService.deleteProject(Number(id));
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getProjectTasks(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();
      const tasks = await ProjectService.getProjectTasks(Number.parseInt(id), params);
      return network.successResponse(tasks);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getProjectUsers(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const users = await ProjectService.getProjectUsers(Number.parseInt(id));
      return network.successResponse(users);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default ProjectController.makeInstance();
