import { CreateCategoryDTO } from "@server/dto/category.dto";
import { CategoryDocument } from "@server/mongo/category.document";
import { BSON, Collection, Filter, ObjectId, UpdateResult } from "mongodb";
import MongoService from "server/services/MongoService";

export class MongoCategoryRepository {
  static #instance: MongoCategoryRepository;
  private table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("categories");
  }
  static makeInstance() {
    return MongoCategoryRepository.#instance ?? new MongoCategoryRepository();
  }

  async findAll(params: Record<string, unknown> = {}): Promise<CategoryDocument[]> {
    const filter: Filter<BSON.Document> = { deletedAt: null };

    if (params?.search) {
      filter.name = { $regex: params.search as string, $options: "i" };
    }

    return this.table.find(filter).sort({ createdAt: "desc" }).toArray() as Promise<BSON.Document[]> as Promise<
      CategoryDocument[]
    >;
  }

  async findOne(id: string): Promise<CategoryDocument | null> {
    return this.table.findOne({ _id: new ObjectId(id) }) as Promise<CategoryDocument | null>;
  }

  async findOneBySlug(slug: string): Promise<CategoryDocument | null> {
    return this.table.findOne({ slug }) as Promise<CategoryDocument | null>;
  }

  async create(body: CreateCategoryDTO) {
    const now = new Date().toISOString();
    const bodyWithTimestamps = {
      ...body,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    return this.table.insertOne(bodyWithTimestamps);
  }

  async save(id: string, body: Record<string, unknown>): Promise<UpdateResult<BSON.Document>> {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { ...body, updatedAt: new Date().toISOString() } });
  }

  async softDelete(id: string) {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}

export const categoryRepository = MongoCategoryRepository.makeInstance();
