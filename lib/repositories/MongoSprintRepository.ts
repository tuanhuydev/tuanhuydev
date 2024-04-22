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

  async getSprints() {
    return this.table.find().toArray();
  }

  async getSprint(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async createSprint(sprint: any) {
    return this.table.insertOne(sprint);
  }

  async updateSprint(id: string, sprint: any) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: sprint });
  }

  async deleteSprint(id: string) {
    return this.table.deleteOne({ _id: new Mongo.ObjectId(id) });
  }
}

export default MongoSprintRepository.makeInstance();
