import * as Mongo from "mongodb";
import MongoService from "server/services/MongoService";

class MongoPermissionRepository {
  static #instance: MongoPermissionRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("permissions");
  }
  static makeInstance() {
    return MongoPermissionRepository.#instance ?? new MongoPermissionRepository();
  }
  async getPermissions() {
    return this.table.find().toArray();
  }
  async getPermission(id: string): Promise<Mongo.BSON.Document | null> {
    return this.table.findOne({ _id: new Mongo.ObjectId(id) });
  }

  async createPermission(body: Record<string, unknown>): Promise<Mongo.InsertOneResult<Mongo.BSON.Document>> {
    body.createdAt = new Date().toISOString();
    body.updatedAt = new Date().toISOString();
    body.deletedAt = null;
    return this.table.insertOne(body);
  }

  async updatePermission(id: string, body: Record<string, unknown>) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: body });
  }
  async deletePermission(id: string) {
    return this.table.updateOne({ _id: new Mongo.ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}
export default MongoPermissionRepository.makeInstance();
