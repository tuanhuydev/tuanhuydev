import * as Mongo from "mongodb";
import MongoService from "server/services/MongoService";

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
    if ("exclude" in filter && Array.isArray(filter.exclude)) {
      defaultWhere = { ...defaultWhere, _id: { $nin: filter.exclude.map((id) => new Mongo.ObjectId(id as string)) } };
    }
    let query = this.table.find(defaultWhere);

    if ("page" in filter && "pageSize" in filter) {
      const page = Number(filter.page);
      const pageSize = Number(filter.pageSize);
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      query.sort({ createdAt: -1 }).skip(skip).limit(limit);
    }

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
