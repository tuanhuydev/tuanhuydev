import { CreateSeriesDTO } from "@server/dto/series.dto";
import { SeriesModel } from "@server/models/series.model";
import { SeriesDocument } from "@server/mongo/series.document";
import { MongoSeriesRepository, seriesRepository } from "@server/repositories/MongoSeriesRepository";
import { BSON, UpdateResult } from "mongodb";

export class SeriesService {
  static instance: SeriesService;

  constructor(private repository: MongoSeriesRepository) {}

  static makeInstance(seriesRepository: MongoSeriesRepository) {
    return SeriesService.instance ?? new SeriesService(seriesRepository);
  }

  async createSeries(data: CreateSeriesDTO): Promise<SeriesModel> {
    const result = await this.repository.create(data);
    if (!result) {
      throw new Error("Failed to create series");
    }
    const seriesModel: SeriesModel | null = await this.getOneSeries(result.insertedId.toHexString());
    if (!seriesModel) {
      throw new Error("Failed to create series");
    }
    return seriesModel;
  }

  async getAllSeries(params: Record<string, unknown> = {}): Promise<SeriesModel[]> {
    const seriesDocuments: SeriesDocument[] = await this.repository.findAll(params);
    return seriesDocuments.map((doc) => SeriesModel.toModel(doc));
  }

  async getOneSeries(id: string): Promise<SeriesModel | null> {
    const seriesDocument: SeriesDocument | null = await this.repository.findOne(id);
    if (!seriesDocument) {
      return null;
    }
    return SeriesModel.toModel(seriesDocument);
  }

  async updateSeries(id: string, data: Partial<CreateSeriesDTO>): Promise<UpdateResult<BSON.Document>> {
    const updated = await this.repository.save(id, data);
    if (!updated) {
      throw new Error("Failed to update series");
    }
    return updated;
  }

  async deleteSeries(id: string): Promise<UpdateResult<BSON.Document>> {
    const deleted = await this.repository.softDelete(id);
    if (!deleted) {
      throw new Error("Failed to delete series");
    }
    return deleted;
  }
}

export const seriesService = SeriesService.makeInstance(seriesRepository);
