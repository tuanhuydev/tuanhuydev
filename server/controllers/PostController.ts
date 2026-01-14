import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import { makeSlug, transformTextToDashed } from "@lib/utils/helper";
import Network from "@lib/utils/network";
import { NextRequest } from "next/server";
import MongoPostRepository from "server/repositories/MongoPostRepository";
import { ObjectSchema, object, string } from "yup";
import { z } from "zod";

export class PostController {
  public static instance: PostController;
  #schema: ObjectSchema<Record<string, unknown>>;

  static makeInstance() {
    return PostController.instance ?? new PostController();
  }

  constructor() {
    this.#schema = object({
      title: string().required(),
      content: string().required(),
    });
  }

  async validateStoreRequest(body: unknown) {
    try {
      return this.#schema.validate(body);
    } catch {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      const body = (await network.getBody()) as Record<string, unknown>;
      const schema = z.object({
        title: z.string(),
        content: z.string(),
        slug: z.string().nullable().optional(),
        thumbnail: z.string().nullable().optional(),
        publishedAt: z.string().nullable().optional(),
      });
      if (!schema.safeParse(body).success) throw new BadRequestError();
      body.slug = makeSlug(body.slug as string);

      const newPost = await MongoPostRepository.createPost(body);

      // Double asset handling
      // await PostPrismaRepository.saveAssets(newPost.id, assets);

      return network.successResponse(newPost);
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();
      const posts = await MongoPostRepository.getPosts(params);
      return network.successResponse(posts);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();
      const postById = await MongoPostRepository.getPost(id);
      return network.successResponse(postById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as Record<string, unknown>;
    if ("slug" in body) {
      body.slug = transformTextToDashed(body.slug as string);
    }
    if (!id || !body) throw new BadRequestError();

    const network = new Network(request);
    try {
      const updated = await MongoPostRepository.updatePost(id, body);
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: { id: string }) {
    if (!id) throw new BadRequestError();
    const network = new Network(request);
    try {
      const deleted = await MongoPostRepository.deletePost(id);
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default PostController.makeInstance();
