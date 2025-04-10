import MongoPermissionRepository from "./MongoPermissionRepository";
import NotFoundError from "@lib/commons/errors/NotFoundError";
import * as Mongo from "mongodb";
import MongoService from "server/services/MongoService";

class MongoUserPermissionRepository {
  static #instance: MongoUserPermissionRepository;
  private table: Mongo.Collection<Mongo.BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("userPermissions");
  }
  static makeInstance() {
    return MongoUserPermissionRepository.#instance ?? new MongoUserPermissionRepository();
  }

  async createUserPermission(body: { userId: Mongo.ObjectId; permissionId: Mongo.ObjectId }) {
    return this.table.insertOne(body);
  }

  async updateUserPermission(
    userId: string,
    permissionId: string,
    updatedPermission: { userId: Mongo.ObjectId; permissionId: Mongo.ObjectId },
  ) {
    const filter = { userId: new Mongo.ObjectId(userId), permissionId: new Mongo.ObjectId(permissionId) };
    const update = { $set: updatedPermission };
    const result = await this.table.updateOne(filter, update);

    if (result.modifiedCount === 0) {
      throw new NotFoundError("User permission not found");
    }
  }
  async getUserPermissions(userId: string) {
    const userPermissions = (await this.table.find({ userId: new Mongo.ObjectId(userId) }).toArray()) || {};
    if (!userPermissions?.length) throw new NotFoundError("User permissions not found");

    const permissions = await Promise.all(
      userPermissions
        .flatMap((userPermission) => userPermission.permissionId)
        .map((permissionId) => MongoPermissionRepository.getPermission(permissionId)),
    );
    return permissions;
  }
}
export default MongoUserPermissionRepository.makeInstance();
