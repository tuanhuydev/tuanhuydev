import { CreateTaskDTO, UpdateTaskDTO } from "@server/dto/Task";
import { TaskModel } from "@server/models/task.model";
import { MongoTaskRepository, mongoTaskRepository } from "@server/repositories/MongoTaskRepository";

export class TaskService {
  static #instance: TaskService;

  static getInstance(repo: MongoTaskRepository): TaskService {
    if (this.#instance) return this.#instance;
    this.#instance = new TaskService(repo);
    return this.#instance;
  }

  constructor(private readonly repo: MongoTaskRepository) {}

  async createTask(data: CreateTaskDTO, userId: string): Promise<TaskModel> {
    const task = await this.repo.create(data, userId);
    return task;
  }

  async getTasks(params: Record<string, unknown>): Promise<TaskModel[]> {
    // TODO turn on params later
    console.log("Params received in getTasks:", params);
    const tasks = await this.repo.findAll(params);
    return tasks;
  }

  async getTask(id: string): Promise<TaskModel | null> {
    const task = await this.repo.findById(id);
    return task;
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<boolean> {
    const updatedTask = await this.repo.save(id, data);
    return updatedTask;
  }
  async deleteTask(id: string): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return result;
  }

  async findTaskById(id: string): Promise<TaskModel[]> {
    const subTasks = await this.repo.findAll({ parentTaskId: id });

    if (!subTasks || subTasks.length === 0) {
      return [];
    }
    return subTasks;
  }
}

export const taskService: TaskService = TaskService.getInstance(mongoTaskRepository);
