import MongoService from "@lib/services/MongoService";
import { ObjectId, Collection, BSON } from "mongodb";

class MongoTaskRepository {
  static #instance: MongoTaskRepository;
  private table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("tasks");
  }

  static makeInstance() {
    return MongoTaskRepository.#instance ?? new MongoTaskRepository();
  }

  async createTask({ projectId, ...restBody }: ObjectType) {
    restBody.createdAt = new Date();
    restBody.updatedAt = new Date();
    restBody.deletedAt = null;
    if (projectId) {
      restBody.projectId = new ObjectId(projectId as string);
    }

    const result = await this.table.insertOne(restBody);
    return result;
  }

  async getTasks(filter: ObjectType = {}) {
    let defaultWhere: ObjectType = { deletedAt: null };
    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, title: { $regex: search, $options: "i" } };
    }

    if ("projectId" in filter) {
      defaultWhere = { ...defaultWhere, projectId: new ObjectId(filter.projectId as string) };
    }

    if ("userId" in filter) {
      const { userId } = filter;
      defaultWhere = {
        ...defaultWhere,
        createdById: userId as unknown as string,
      };
    }

    let query = this.table.find(defaultWhere);

    if (orderBy) {
      const sort: ObjectType = {};
      orderBy.forEach((order: any) => {
        sort[order.field] = order.direction === "desc" ? -1 : 1;
      });
      query = query.sort(sort);
    }

    if (page && pageSize) {
      query = query.skip((page - 1) * pageSize).limit(pageSize);
    } else if (pageSize) {
      query = query.limit(pageSize);
    }

    return query.toArray();
  }

  async getTask(id: string) {
    return this.table.findOne({ deletedAt: null, _id: new ObjectId(id) });
  }

  async updateTask(id: string, { assigneeId, projectId, ...restData }: Partial<TaskBody>) {
    const bodyToUpdate = {
      $set: {
        ...restData,
        projectId: projectId ? new ObjectId(projectId) : null,
        assigneeId: assigneeId ? new ObjectId(assigneeId) : null,
      },
    };
    this.table.updateOne({ _id: new ObjectId(id) }, bodyToUpdate);
    return true;
  }

  async deleteTask(id: string) {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date() } });
  }

  async getTasksByProject(projectId: string, filter: ObjectType = {}) {
    return this.getTasks({ ...filter, projectId });
  }
}

export default MongoTaskRepository.makeInstance();
