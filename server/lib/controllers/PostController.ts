import MongoPostRepository from "@lib/repositories/MongoPostRepository";
import BadRequestError from "@lib/shared/commons/errors/BadRequestError";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { BaseController } from "@lib/shared/interfaces/controller";
import { makeSlug, transformTextToDashed } from "@lib/shared/utils/helper";
import Network from "@lib/shared/utils/network";
import { NextRequest } from "next/server";
import { ObjectSchema, object, string } from "yup";
import { z } from "zod";

export class PostController implements BaseController {
  public static instance: PostController;
  #schema: ObjectSchema<any>;

  static makeInstance() {
    return PostController.instance ?? new PostController();
  }

  constructor() {
    this.#schema = object({
      title: string().required(),
      content: string().required(),
    });
  }

  async validateStoreRequest(body: any) {
    try {
      return this.#schema.validate(body);
    } catch (error) {
      throw new BadRequestError();
    }
  }

  async store(request: NextRequest, params: ObjectType) {
    const network = Network(request);
    try {
      const { assets = [], ...restBody } = await network.getBody();
      const schema = z.object({
        title: z.string(),
        content: z.string(),
        slug: z.string().nullable().optional(),
        thumbnail: z.string().nullable().optional(),
        publishedAt: z.string().nullable().optional(),
      });
      if (!schema.safeParse(restBody).success) throw new BadRequestError();
      restBody.slug = makeSlug(restBody.slug);

      const newPost = await MongoPostRepository.createPost(restBody);

      // Double asset handling
      // await PostPrismaRepository.saveAssets(newPost.id, assets);

      return network.successResponse(newPost);
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();
      const posts = await MongoPostRepository.getPosts(params);
      return network.successResponse(posts);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      if (!id) throw new BadRequestError();
      const postById = await MongoPostRepository.getPost(id);
      return network.successResponse(postById);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const body = await request.json();
    if ("slug" in body) {
      body.slug = transformTextToDashed(body.slug);
    }
    if (!id || !body) throw new BadRequestError();

    const network = Network(request);
    try {
      const updated = await MongoPostRepository.updatePost(id, body);
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: any) {
    if (!id) throw new BadRequestError();
    const network = Network(request);
    try {
      const deleted = await MongoPostRepository.deletePost(id);
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default PostController.makeInstance();
