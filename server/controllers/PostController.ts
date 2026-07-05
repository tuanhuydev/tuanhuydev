import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { makeSlug, transformTextToDashed } from "@lib/utils/helper";
import Network from "@lib/utils/network";
import { CreatePostDTO, createPostSchema, UpdatePostDTO } from "@server/dto/post.dto";
import { PostJSON, PostModel } from "@server/models/post.model";
import { authService, AuthService } from "@server/services/AuthService";
import { postService } from "@server/services/PostService";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export class PostController {
  public static instance: PostController;

  static makeInstance(authService: AuthService) {
    return PostController.instance ?? new PostController(authService);
  }

  constructor(private readonly authService: AuthService) {}

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      // Validate request body
      const body = (await network.getBody()) as CreatePostDTO;
      const validation = createPostSchema.safeParse(body);
      if (!validation.success) throw new BadRequestError(validation?.error.toString());

      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      body.authorId = currentUser.id;
      body.slug = makeSlug(body.slug);
      const newPost = (await postService.createPost(body)) as unknown as PostModel;
      revalidateTag("posts", "max");
      return network.successResponse(newPost.toJSON());
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();
      const postModels: PostModel[] = await postService.getAllPosts(params);

      const posts: PostJSON[] = postModels.map((post: PostModel) => post.toJSON());
      return network.successResponse(posts);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const postById = await postService.getOnePost(id);
      if (!postById) throw new BadRequestError("Post not found");

      return network.successResponse(postById.toJSON());
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as UpdatePostDTO;
    if (body?.slug) {
      body.slug = transformTextToDashed(body.slug);
    }
    if (!id || !body) throw new BadRequestError();

    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const updated = await postService.updatePost(id, body);
      revalidateTag("posts", "max");
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: { id: string }) {
    if (!id) throw new BadRequestError();
    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const deleted = await postService.deletePost(id);
      revalidateTag("posts", "max");
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export const postController = PostController.makeInstance(authService);
