import { CreateSeriesDTO } from "@server/dto/series.dto";
import { SeriesDocument } from "@server/mongo/series.document";
import { BSON, Collection, Filter, ObjectId, UpdateResult } from "mongodb";
import MongoService from "server/services/MongoService";

export class MongoSeriesRepository {
  static #instance: MongoSeriesRepository;
  private table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("series");
  }
  static makeInstance() {
    return MongoSeriesRepository.#instance ?? new MongoSeriesRepository();
  }

  async findAll(params: Record<string, unknown> = {}): Promise<SeriesDocument[]> {
    const filter: Filter<BSON.Document> = { deletedAt: null };

    if (params?.search) {
      filter.name = { $regex: params.search as string, $options: "i" };
    }

    return this.table.find(filter).sort({ createdAt: "desc" }).toArray() as Promise<BSON.Document[]> as Promise<
      SeriesDocument[]
    >;
  }

  async findOne(id: string): Promise<SeriesDocument | null> {
    return this.table.findOne({ _id: new ObjectId(id) }) as Promise<SeriesDocument | null>;
  }

  async findOneBySlug(slug: string): Promise<SeriesDocument | null> {
    return this.table.findOne({ slug }) as Promise<SeriesDocument | null>;
  }

  async create(body: CreateSeriesDTO) {
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

export const seriesRepository = MongoSeriesRepository.makeInstance();
