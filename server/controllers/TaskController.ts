import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import { BaseController } from "@lib/interfaces/controller";
import Network from "@lib/utils/network";
import { CreateTaskDto } from "@server/dto/Task";
import LogService from "@server/services/LogService";
import { NextRequest } from "next/server";
import MongoTaskRepository from "server/repositories/MongoTaskRepository";
import AuthService from "server/services/AuthService";
import { z } from "zod";

export class TaskController implements BaseController {
  static #instance: TaskController;

  static makeInstance() {
    if (TaskController.#instance) return TaskController.#instance;
    return new TaskController();
  }

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      const schema = z.object({
        title: z.string(),
        description: z.string(),
        status: z.string(),
      });

      const dto: CreateTaskDto = await network.getBody();

      const validate = schema.safeParse(dto);
      if (!validate.success) throw new BadRequestError();

      const { id: tokenUserId } = await AuthService.getCurrentUserProfile();
      dto.createdById = tokenUserId;
      dto.createdAt = new Date();
      dto.updatedAt = new Date();
      dto.deletedAt = null;

      const newTask = await MongoTaskRepository.createTask(dto as unknown as Omit<Task, "id">);
      return network.successResponse(newTask);
    } catch (error) {
      LogService.log((error as Error).message);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest, userId?: string) {
    const network = new Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();
      if (userId) params.userId = userId;
      const tasks = await MongoTaskRepository.getTasks(params);
      return network.successResponse(tasks);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getTasksByUser(request: NextRequest, { id }: any) {
    if (!id) throw new BadRequestError();

    let userId = id;
    if (id === "me") {
      const { id: tokenUserId } = await AuthService.getCurrentUserProfile();
      userId = tokenUserId as string;
    }

    return this.getAll(request, userId);
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const taskById = await MongoTaskRepository.getTask(id);
      return network.successResponse(taskById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const network = new Network(request);
    try {
      const body = await network.getBody();
      if (!id || !body) throw new BadRequestError();

      const updated = await MongoTaskRepository.updateTask(id, body);
      return network.successResponse(updated);
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: any) {
    if (!id) throw new BadRequestError();
    const network = new Network(request);
    try {
      const deleted = await MongoTaskRepository.deleteTask(id);
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getSubTasks(request: NextRequest, { id }: any) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const subTasks = await MongoTaskRepository.getSubTasks(id);
      return network.successResponse(subTasks);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default TaskController.makeInstance();
