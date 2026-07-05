import { CreatePostDTO } from "@server/dto/post.dto";
import { PostDocument } from "@server/mongo/post.document";
import { BSON, Collection, Filter, ObjectId, Sort, UpdateResult } from "mongodb";
import MongoService from "server/services/MongoService";

export class MongoPostRepository {
  static #instance: MongoPostRepository;
  private table: Collection<BSON.Document>;

  constructor() {
    this.table = MongoService.getDatabase().collection("posts");
  }
  static makeInstance() {
    return MongoPostRepository.#instance ?? new MongoPostRepository();
  }

  async findAll(params: Record<string, unknown> = {}): Promise<PostDocument[]> {
    let filter: Filter<BSON.Document> = { deletedAt: null };

    if (params?.search) {
      filter.title = { $regex: params.search as string, $options: "i" };
    }
    if (params?.publishedAt === true) {
      filter.publishedAt = { $ne: null };
    }
    if (params?.exclude && Array.isArray(params.exclude)) {
      filter._id = { $nin: params.exclude.map((id) => new ObjectId(id as string)) };
    }
    if (params?.categoryId) {
      filter.categoryId = new ObjectId(params.categoryId as string);
    }
    if (params?.seriesId) {
      filter.seriesId = new ObjectId(params.seriesId as string);
    }
    if (params?.tagId) {
      filter.tagIds = { $in: [new ObjectId(params.tagId as string)] };
    }

    let query = this.table.find(filter);

    // Handle sorting
    let sortOption: Record<string, unknown> = { createdAt: "desc" };
    const defaultSortBy: string = "createdAt";
    const defaultSortOrder: string = "desc";
    if (params?.sortBy) {
      const sortBy = (params.sortBy as string) ?? defaultSortBy;
      const sortOrder = params?.sortOrder ?? defaultSortOrder;
      sortOption = { [sortBy]: sortOrder };
    }

    if (params?.page && params?.pageSize) {
      const page = Number(params.page);
      const pageSize = Number(params.pageSize);
      if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
        throw new Error("Invalid pagination parameters");
      }
      const skip = (page - 1) * pageSize;
      const limit = pageSize;
      query
        .sort(sortOption as Sort)
        .skip(skip)
        .limit(limit);
    } else {
      query.sort(sortOption as Sort);
    }

    return query.toArray() as Promise<BSON.Document[]> as Promise<PostDocument[]>;
  }

  async findOne(id: string): Promise<PostDocument | null> {
    return this.table.findOne({ _id: new ObjectId(id) }) as Promise<PostDocument | null>;
  }

  async findOneBySlug(slug: string) {
    return this.table.findOne({ slug });
  }

  async create(body: CreatePostDTO) {
    const now = new Date().toISOString();
    const bodyWithTimestamps = {
      ...body,
      ...this.castRelationIds(body),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    return this.table.insertOne(bodyWithTimestamps);
  }

  async save(id: string, body: Record<string, unknown>): Promise<UpdateResult<BSON.Document>> {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { ...body, ...this.castRelationIds(body) } });
  }

  private castRelationIds(body: Record<string, unknown>): Record<string, unknown> {
    const cast: Record<string, unknown> = {};
    if ("categoryId" in body) {
      cast.categoryId = body.categoryId ? new ObjectId(body.categoryId as string) : null;
    }
    if ("seriesId" in body) {
      cast.seriesId = body.seriesId ? new ObjectId(body.seriesId as string) : null;
    }
    if ("tagIds" in body) {
      cast.tagIds = Array.isArray(body.tagIds) ? body.tagIds.map((tagId) => new ObjectId(tagId as string)) : [];
    }
    return cast;
  }

  async softDelete(id: string) {
    return this.table.updateOne({ _id: new ObjectId(id) }, { $set: { deletedAt: new Date().toISOString() } });
  }
}

export const postRepository = MongoPostRepository.makeInstance();
