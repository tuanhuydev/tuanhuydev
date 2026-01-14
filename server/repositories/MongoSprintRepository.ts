import MongoService from "../services/MongoService";
import * as Mongo from "mongodb";

class MongoSprintRepository {
  static #instance: MongoSprintRepository;
  table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("sprints");
  }

  static makeInstance() {
    return MongoSprintRepository.#instance ?? new MongoSprintRepository();
  }

  async getSprints(filter: Record<string, unknown> = {}) {
    let defaultWhere: Record<string, unknown> = { deletedAt: null };

    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, name: { $regex: search, $options: "i" } };
    }

    if ("projectId" in filter) {
      defaultWhere = { ...defaultWhere, projectId: filter.projectId as string };
    }
    if ("active" in filter) {
      defaultWhere = { ...defaultWhere, active: filter.active as boolean };
    }

    let query = this.table.find(defaultWhere);

    if (orderBy) {
      const sort: Record<string, unknown> = {};
      (orderBy as Array<{ field: string; direction: string }>).forEach((order) => {
        sort[order.field] = order.direction === "desc" ? -1 : 1;
      });
      query = query.sort(sort as Mongo.Sort);
    }

    if (page && pageSize) {
      query = query.skip(((page as number) - 1) * (pageSize as number)).limit(pageSize as number);
    } else if (pageSize) {
      query = query.limit(pageSize as number);
    }

    return query.toArray();
  }

  async getActiveSprintByProjectId(projectId: string) {
    return this.table.findOne({ projectId: new Mongo.ObjectId(projectId), active: true });
  }

  async getSprint(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async createSprint(newSprintData: Record<string, unknown>) {
    return this.table.insertOne(newSprintData);
  }

  async updateSprint(id: string, sprint: Record<string, unknown>) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: sprint });
  }

  async deleteSprint(id: string) {
    return this.table.deleteOne({ _id: new Mongo.ObjectId(id) });
  }
}

export default MongoSprintRepository.makeInstance();
