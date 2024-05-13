import MongoService from "@lib/services/MongoService";
import * as Mongo from "mongodb";

class MongoPostRepository {
  static #instance: MongoPostRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("posts");
  }
  static makeInstance() {
    return MongoPostRepository.#instance ?? new MongoPostRepository();
  }
  async getPosts(filter: ObjectType = {}) {
    let defaultWhere: ObjectType = { deletedAt: null };
    if (!filter) {
      return this.table.find(defaultWhere).toArray();
    }
    if ("search" in filter) {
      defaultWhere = { ...defaultWhere, title: { $regex: filter.search, $options: "i" } };
    }
    if ("published" in filter) {
      defaultWhere = { ...defaultWhere, publishedAt: { $ne: null } };
    }
    let query = this.table.find(defaultWhere);
    return query.toArray();
  }
  async getPost(id: string) {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async getPostBySlug(slug: string) {
    return this.table.findOne({ slug });
  }

  async createPost(body: ObjectType) {
    body.createdAt = new Date().toISOString();
    return this.table.insertOne(body);
  }

  async updatePost(id: string, body: ObjectType) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: body });
  }
  async deletePost(id: string) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}
export default MongoPostRepository.makeInstance();
