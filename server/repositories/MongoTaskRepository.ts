import { CreateTaskDTO, UpdateTaskDTO } from "@server/dto/task.dto";
import { TaskModel } from "@server/models/task.model";
import { TaskDocument } from "@server/mongo/task.document";
import MongoService from "@server/services/MongoService";
import { Collection, ObjectId } from "mongodb";

export class MongoTaskRepository {
  private static instance: MongoTaskRepository;
  private collection: Collection;

  private constructor() {
    this.collection = MongoService.getDatabase().collection("tasks");
  }

  static getInstance(): MongoTaskRepository {
    if (!this.instance) {
      this.instance = new MongoTaskRepository();
    }
    return this.instance;
  }

  async create(taskData: CreateTaskDTO, userId: string): Promise<TaskModel> {
    const taskDoc: Omit<TaskDocument, "_id"> = {
      ...taskData,
      createdById: new ObjectId(userId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentTaskId: taskData?.parentTaskId ? new ObjectId(taskData.parentTaskId) : null,
      storyPoint: taskData.storyPoint || 0,
      deletedAt: null,
      assigneeId: null,
      projectId: null,
      sprintId: null,
    };
    const result = await this.collection.insertOne(taskDoc);

    const createdDocument = await this.findById(result.insertedId.toHexString());
    return TaskModel.toModel(createdDocument as unknown as TaskDocument);
  }

  async save(id: string, task: UpdateTaskDTO): Promise<boolean> {
    const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: task }, { upsert: true });
    return result.modifiedCount > 0;
  }

  async findById(id: string): Promise<TaskModel | null> {
    const doc = await this.collection.findOne({
      _id: new ObjectId(id),
      deletedAt: null,
    });

    return doc ? TaskModel.toModel(doc as unknown as TaskDocument) : null;
  }

  async findAll(params: Record<string, unknown>): Promise<TaskModel[]> {
    const query: Record<string, unknown> = { deletedAt: null };

    // Example of handling a filter parameter
    if (params.userId) {
      query.createdById = new ObjectId(params.userId as string);
    }
    if (params.parentTaskId) {
      query.parentTaskId = new ObjectId(params.parentTaskId as string);
    }

    const docs = await this.collection.find(query).sort({ createdAt: -1 }).toArray();
    return docs.map((doc) => TaskModel.toModel(doc as unknown as TaskDocument));
  }

  async findByProject(projectId: string): Promise<TaskModel[]> {
    const docs = await this.collection
      .find({
        projectId: new ObjectId(projectId),
        deletedAt: null,
      })
      .toArray();

    return docs.map((doc) => TaskModel.toModel(doc as unknown as TaskDocument));
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date() } });
    return result.modifiedCount > 0;
  }
}

export const mongoTaskRepository = MongoTaskRepository.getInstance();
