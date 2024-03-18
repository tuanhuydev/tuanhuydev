import LogService from "../services/LogService";
import TaskService from "../services/TaskService";
import { verifyJwt } from "@app/_utils/network";
import { ACCESS_TOKEN_SECRET } from "@lib/shared/commons/constants/encryption";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { BaseController } from "@lib/shared/interfaces/controller";
import Network from "@lib/shared/utils/network";
import BadRequestError from "@shared/commons/errors/BadRequestError";
import BaseError from "@shared/commons/errors/BaseError";
import * as jose from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ObjectSchema, object, string, number } from "yup";

export class TaskController implements BaseController {
  #schema: ObjectSchema<any>;
  static #instance: TaskController;

  static makeInstance() {
    return TaskController.#instance ?? new TaskController();
  }

  constructor() {
    this.#schema = object({
      title: string().required(),
      description: string().required(),
      projectId: number().nullable(),
    });
  }

  async validate(body: any, schema: ObjectSchema<any>) {
    try {
      return schema.validate(body);
    } catch (error) {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest) {
    const network = Network(request);
    try {
      const schema = object({
        title: string().required(),
        description: string().required(),
        statusId: string().required(),
        projectId: number().nullable(),
      });

      const body = await request.json();
      const validatedBody = await this.validate(body, schema);

      validatedBody.statusId = parseInt(validatedBody.statusId, 10);
      const { userId } = await verifyJwt(cookies().get("jwt")?.value);
      validatedBody.createdById = userId;

      const newTask = await TaskService.createTask(validatedBody);
      return network.successResponse(newTask);
    } catch (error) {
      LogService.log((error as Error).message);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();
      const tasks = await TaskService.getTasks(params);
      return network.successResponse(tasks);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const projectById = await TaskService.getTask(id);
      return network.successResponse(projectById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const body = await request.json();
    if (!id || !body) throw new BadRequestError();

    const network = Network(request);
    if (body.statusId) body.statusId = Number.parseInt(body.statusId, 10);
    try {
      const updated = await TaskService.updateTask(Number(id), body);
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: any) {
    if (!id) throw new BadRequestError();
    const network = Network(request);
    try {
      const deleted = await TaskService.deleteTask(Number(id));
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default TaskController.makeInstance();
