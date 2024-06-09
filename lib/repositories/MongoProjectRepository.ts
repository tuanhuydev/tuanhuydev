import MongoService from "@lib/services/MongoService";
import * as Mongo from "mongodb";

class MongoProjectRepository {
  static #instance: MongoProjectRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("projects");
  }
  static makeInstance() {
    return MongoProjectRepository.#instance ?? new MongoProjectRepository();
  }
  async createProject(body: ObjectType) {
    return this.table.insertOne(body);
  }

  async getProjects(filter: ObjectType = {}) {
    let defaultWhere: ObjectType = { deletedAt: null };
    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, name: { $regex: search, $options: "i" } };
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
  async getProject(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async updateProject(id: string, body: ObjectType) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: body });
  }
  async deleteProject(id: string) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}
export default MongoProjectRepository.makeInstance();
