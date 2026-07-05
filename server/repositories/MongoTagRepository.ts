import { CreateTagDTO } from "@server/dto/tag.dto";
import { TagDocument } from "@server/mongo/tag.document";
import { BSON, Collection, Filter, ObjectId, UpdateResult } from "mongodb";
import MongoService from "server/services/MongoService";

export class MongoTagRepository {
  static #instance: MongoTagRepository;
  private table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("tags");
  }
  static makeInstance() {
    return MongoTagRepository.#instance ?? new MongoTagRepository();
  }

  async findAll(params: Record<string, unknown> = {}): Promise<TagDocument[]> {
    const filter: Filter<BSON.Document> = { deletedAt: null };

    if (params?.search) {
      filter.name = { $regex: params.search as string, $options: "i" };
    }
    if (params?.ids && Array.isArray(params.ids)) {
      filter._id = { $in: params.ids.map((id) => new ObjectId(id as string)) };
    }

    return this.table.find(filter).sort({ createdAt: "desc" }).toArray() as Promise<BSON.Document[]> as Promise<
      TagDocument[]
    >;
  }

  async findOne(id: string): Promise<TagDocument | null> {
    return this.table.findOne({ _id: new ObjectId(id) }) as Promise<TagDocument | null>;
  }

  async findOneBySlug(slug: string): Promise<TagDocument | null> {
    return this.table.findOne({ slug }) as Promise<TagDocument | null>;
  }

  async create(body: CreateTagDTO) {
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

export const tagRepository = MongoTagRepository.makeInstance();
