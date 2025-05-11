import MongoService from "../services/MongoService";
import BadRequestError from "@lib/commons/errors/BadRequestError";
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

  async getUsers(filter: any = {}) {
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

  async getUser(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async getUserByEmail(email: string) {
    return this.table.findOne({ email });
  }

  async createUser(body: ObjectType = {}) {
    const { email } = body;
    if (!email) throw new BadRequestError("Email is required");

    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new BadRequestError("Email already exists");

    return this.table.insertOne(body);
  }

  async updateUser(id: string, user: any) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: user });
  }

  async deleteUser(id: string) {
    return this.table.deleteOne({ _id: new Mongo.ObjectId(id) });
  }
}

export default MongoUserRepository.makeInstance();
