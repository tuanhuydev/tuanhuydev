import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import { CreateTaskDTO } from "@server/dto/task.dto";
import { logService } from "@server/services/LogService";
import { taskService, TaskService } from "@server/services/TaskService";
import { NextRequest } from "next/server";
import { authService } from "server/services/AuthService";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.string(),
});

export class TaskController {
  static #instance: TaskController;

  private constructor(private readonly taskService: TaskService) {}

  static makeInstance(taskService: TaskService): TaskController {
    if (TaskController.#instance) return TaskController.#instance;
    return new TaskController(taskService);
  }

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      const dto = (await network.getBody()) as CreateTaskDTO;

      const validate = schema.safeParse(dto);
      if (!validate.success) throw new BadRequestError();

      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new BadRequestError();

      const newTask = await this.taskService.createTask(dto as unknown as CreateTaskDTO, currentUser.id);
      return network.successResponse(newTask);
    } catch (error) {
      logService.log((error as Error).message);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest, userId?: string) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();
      if (userId) params.userId = userId;
      const tasks = await this.taskService.getTasks(params);
      if (!Array.isArray(tasks)) {
        throw new BadRequestError("Expected an array of tasks");
      }

      const tasksJson = Array.isArray(tasks) ? tasks.map((task) => task.toJSON?.() ?? task) : tasks;

      return network.successResponse(tasksJson);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getTasksByUser(request: NextRequest, { id }: { id?: string }) {
    if (!id) throw new BadRequestError();

    let userId = id;
    if (id === "me") {
      const currentUser = await authService.getCurrentUserProfile();
      if (!currentUser) throw new BadRequestError();
      userId = currentUser.id;
    }

    return this.getAll(request, userId);
  }

  async getOne(request: NextRequest, { id }: { id?: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const taskById = await taskService.getTask(id);
      if (!taskById) throw new BadRequestError("Task not found");

      return network.successResponse(taskById?.toJSON());
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id?: string }) {
    const network = new Network(request);
    try {
      const body = await network.getBody();
      if (!id || !body) throw new BadRequestError();

      const updated = await taskService.updateTask(id, body);
      return network.successResponse(updated);
    } catch (error) {
      logService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: { id?: string }) {
    if (!id) throw new BadRequestError();
    const network = new Network(request);
    try {
      const deleted = await taskService.deleteTask(id);
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getSubTasks(request: NextRequest, { id }: { id?: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const subTasks = await taskService.findTaskById(id);

      const subTasksJson = subTasks.map((task) => task.toJSON?.() ?? task);

      return network.successResponse(subTasksJson);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default TaskController.makeInstance(taskService);
