import MongoService from "../services/MongoService";
import * as Mongo from "mongodb";

class MongoUserRepository {
  static #instance: MongoUserRepository;
  table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("users");
  }

  static makeInstance() {
    return MongoUserRepository.#instance ?? new MongoUserRepository();
  }

  async getUsers(filter: any) {
    let defaultWhere = {};
    return this.table.find().toArray();
  }

  async getUser(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async getUserByEmail(email: string) {
    return this.table.findOne({ email });
  }

  async createUser(sprint: any) {
    return this.table.insertOne(sprint);
  }

  async updateUser(id: string, sprint: any) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: sprint });
  }

  async deleteUser(id: string) {
    return this.table.deleteOne({ _id: new Mongo.ObjectId(id) });
  }
}

export default MongoUserRepository.makeInstance();
