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

  async getSprints(filter: ObjectType = {}) {
    let defaultWhere: ObjectType = { deletedAt: null };

    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, name: { $regex: search, $options: "i" } };
    }

    if ("projectId" in filter) {
      defaultWhere = { ...defaultWhere, projectId: new Mongo.ObjectId(filter.projectId as string) };
    }
    if ("active" in filter) {
      defaultWhere = { ...defaultWhere, active: filter.active as boolean };
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

  async getActiveSprintByProjectId(projectId: string) {
    return this.table.findOne({ projectId: new Mongo.ObjectId(projectId), active: true });
  }

  async getSprint(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async createSprint(newSprintData: any) {
    if ("projectId" in newSprintData) {
      newSprintData.projectId = new Mongo.ObjectId(newSprintData.projectId as string);
    }
    return this.table.insertOne(newSprintData);
  }

  async updateSprint(id: string, sprint: any) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: sprint });
  }

  async deleteSprint(id: string) {
    return this.table.deleteOne({ _id: new Mongo.ObjectId(id) });
  }
}

export default MongoSprintRepository.makeInstance();
