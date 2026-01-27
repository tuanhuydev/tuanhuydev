import * as Mongo from "mongodb";
import MongoService from "server/services/MongoService";

class MongoProjectRepository {
  static #instance: MongoProjectRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("projects");
  }
  static makeInstance() {
    return MongoProjectRepository.#instance ?? new MongoProjectRepository();
  }
  async createProject(body: Record<string, unknown>) {
    // TODO: Define model
    return this.table.insertOne(body);
  }

  async getProjects(filter: Record<string, unknown> = {}) {
    let defaultWhere: Record<string, unknown> = { deletedAt: null };
    //TODO: Make get filter abstract.
    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }

    const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, name: { $regex: search, $options: "i" } };
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

  async getProject(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async updateProject(id: string, body: Record<string, unknown>) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: body });
  }
  async deleteProject(id: string) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}
export default MongoProjectRepository.makeInstance();
