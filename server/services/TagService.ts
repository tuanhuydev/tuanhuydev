import { CreateTagDTO } from "@server/dto/tag.dto";
import { TagModel } from "@server/models/tag.model";
import { TagDocument } from "@server/mongo/tag.document";
import { MongoTagRepository, tagRepository } from "@server/repositories/MongoTagRepository";
import { BSON, UpdateResult } from "mongodb";

export class TagService {
  static instance: TagService;

  constructor(private repository: MongoTagRepository) {}

  static makeInstance(tagRepository: MongoTagRepository) {
    return TagService.instance ?? new TagService(tagRepository);
  }

  async createTag(data: CreateTagDTO): Promise<TagModel> {
    const result = await this.repository.create(data);
    if (!result) {
      throw new Error("Failed to create tag");
    }
    const tagModel: TagModel | null = await this.getOneTag(result.insertedId.toHexString());
    if (!tagModel) {
      throw new Error("Failed to create tag");
    }
    return tagModel;
  }

  async getAllTags(params: Record<string, unknown> = {}): Promise<TagModel[]> {
    const tagDocuments: TagDocument[] = await this.repository.findAll(params);
    return tagDocuments.map((doc) => TagModel.toModel(doc));
  }

  async getOneTag(id: string): Promise<TagModel | null> {
    const tagDocument: TagDocument | null = await this.repository.findOne(id);
    if (!tagDocument) {
      return null;
    }
    return TagModel.toModel(tagDocument);
  }

  async updateTag(id: string, data: Partial<CreateTagDTO>): Promise<UpdateResult<BSON.Document>> {
    const updated = await this.repository.save(id, data);
    if (!updated) {
      throw new Error("Failed to update tag");
    }
    return updated;
  }

  async deleteTag(id: string): Promise<UpdateResult<BSON.Document>> {
    const deleted = await this.repository.softDelete(id);
    if (deleted.matchedCount === 0) {
      throw new Error("Tag not found");
    }
    return deleted;
  }
}

export const tagService = TagService.makeInstance(tagRepository);
