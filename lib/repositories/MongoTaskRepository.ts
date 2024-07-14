import MongoService from "@lib/services/MongoService";
import { BSON, Collection, ObjectId } from "mongodb";

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

  private applySearchFilter(where: ObjectType, search: string = ""): ObjectType {
    if (search) {
      return { ...where, title: { $regex: search, $options: "i" } };
    }
    return where;
  }

  private applyProjectIdFilter(where: ObjectType, projectId?: string): ObjectType {
    return typeof projectId === "string"
      ? { ...where, projectId: new ObjectId(projectId) }
      : { ...where, $or: [{ projectId: null }, { projectId: { $exists: false } }] };
  }

  private applyUserIdFilter(where: ObjectType, userId?: string): ObjectType {
    if (userId) {
      return { ...where, createdById: userId };
    }
    return where;
  }

  private applySorting(
    query: any,
    orderBy: Array<{ field: string; direction: string }> = [{ field: "createdAt", direction: "desc" }],
  ): any {
    const sort: ObjectType = {};
    orderBy.forEach((order) => {
      sort[order.field] = order.direction === "desc" ? -1 : 1;
    });
    return query.sort(sort);
  }

  private applyPagination(query: any, page?: number, pageSize?: number): any {
    if (page && pageSize) {
      return query.skip((page - 1) * pageSize).limit(pageSize);
    } else if (pageSize) {
      return query.limit(pageSize);
    }
    return query;
  }

  private constructWhereStatement = (filter: ObjectType) => {
    let defaultWhere: ObjectType = { deletedAt: null };
    defaultWhere = this.applySearchFilter(defaultWhere, filter?.search);
    defaultWhere = this.applyProjectIdFilter(defaultWhere, filter?.projectId);
    defaultWhere = this.applyUserIdFilter(defaultWhere, filter?.userId);

    let query = this.table.find(defaultWhere);
    query = this.applySorting(query, filter?.orderBy);
    query = this.applyPagination(query, filter?.page, filter?.pageSize);

    return defaultWhere;
  };

  async getTasks(filter: ObjectType = {}) {
    const where = this.constructWhereStatement(filter);
    return this.table.find(where).toArray();
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
