import { CreatePostDTO } from "@server/dto/post.dto";
import { PostModel } from "@server/models/post.model";
import { PostDocument } from "@server/mongo/post.document";
import { postRepository, MongoPostRepository } from "@server/repositories/MongoPostRepository";
import { BSON, UpdateResult, WithId } from "mongodb";

export class PostService {
  static instance: PostService;

  constructor(private repository: MongoPostRepository) {}

  static makeInstance(postRepository: MongoPostRepository) {
    return PostService.instance ?? new PostService(postRepository);
  }

  async createPost(data: CreatePostDTO): Promise<PostModel> {
    const result = await this.repository.create(data);
    if (!result) {
      throw new Error("Failed to create post");
    }
    const postModel: PostModel | null = await this.getOnePost(result.insertedId.toHexString());
    if (!postModel) {
      throw new Error("Failed to create post");
    }
    return postModel;
  }

  async getAllPosts(params: Record<string, unknown> = {}): Promise<PostModel[]> {
    const postDocuments: PostDocument[] = await this.repository.findAll(params);
    return postDocuments.map((doc) => PostModel.toModel(doc));
  }

  async getOnePost(id: string): Promise<PostModel | null> {
    const postDocument: PostDocument | null = await this.repository.findOne(id);
    if (!postDocument) {
      return null;
    }
    return PostModel.toModel(postDocument);
  }

  async getPostBySlug(slug: string): Promise<PostModel | null> {
    const postDocument: PostDocument | null = (await this.repository.findOneBySlug(
      slug,
    )) as WithId<PostDocument> | null;
    if (!postDocument) {
      return null;
    }
    return PostModel.toModel(postDocument);
  }

  async updatePost(id: string, data: Partial<CreatePostDTO>): Promise<UpdateResult<BSON.Document>> {
    const updated = await this.repository.save(id, data);
    if (!updated) {
      throw new Error("Failed to update post");
    }
    return updated;
  }

  async deletePost(id: string): Promise<UpdateResult<BSON.Document>> {
    const deleted = await this.repository.softDelete(id);
    if (!deleted) {
      throw new Error("Failed to delete post");
    }
    return deleted;
  }
}

export const postService = PostService.makeInstance(postRepository);
