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
    return this.table.find().toArray();
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
