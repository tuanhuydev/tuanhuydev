import { CreatePermissionDTO, UpdatePermissionDTO } from "@server/dto/permission.dto";
import { BSON, Collection, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import MongoService from "server/services/MongoService";

export class MongoPermissionRepository {
  static #instance: MongoPermissionRepository;
  private table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("permissions");
  }
  static makeInstance() {
    return MongoPermissionRepository.#instance ?? new MongoPermissionRepository();
  }

  async findAll(): Promise<WithId<BSON.Document>[]> {
    return this.table.find().toArray();
  }

  async findOne(id: string): Promise<BSON.Document | null> {
    return this.table.findOne({ _id: new ObjectId(id) });
  }

  async create(body: CreatePermissionDTO): Promise<InsertOneResult<BSON.Document>> {
    return this.table.insertOne(body);
  }

  async save(id: string, body: UpdatePermissionDTO): Promise<UpdateResult<BSON.Document>> {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: body });
  }

  async softDelete(id: string) {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}

export const permissionRepository = MongoPermissionRepository.makeInstance();
