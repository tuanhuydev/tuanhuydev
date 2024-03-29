import { Asset } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import BaseError from "@shared/commons/errors/BaseError";

export type PostFilter = {
  page?: number;
  pageSize?: number;
  active?: boolean;
  search?: string;
  orderBy?: ObjectType[];
};

class PostService {
  static #instance: PostService;

  static makeInstance() {
    if (PostService.#instance) {
      return PostService.#instance;
    }
    return new PostService();
  }

  async createPost(body: ObjectType) {
    try {
      return await prismaClient.post.create({ data: body as any });
    } catch (error: any) {
      throw new BaseError((error as Error).message);
    }
  }

  async saveAssets(postId: number, assets: Partial<Asset>[]) {
    const postAssets = assets.map((assetId: any) => ({ postId, assetId }));
    return await prismaClient.postAsset.createMany({
      data: postAssets,
      skipDuplicates: true,
    });
  }

  async getPosts(filter?: PostFilter) {
    let defaultWhere: ObjectType = { deletedAt: null };
    if (!filter) return await prismaClient.post.findMany({ where: defaultWhere });
    const { page = 1, pageSize = 10, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

    if (search) {
      defaultWhere = {
        ...defaultWhere,
        title: {
          startsWith: search,
        },
      };
    }
    if ("active" in filter) {
      defaultWhere = {
        ...defaultWhere,
        publishedAt: filter?.active ? { not: null } : null,
      };
    }

    let query: any = {
      include: { PostAsset: true },
      where: defaultWhere,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: orderBy.map((order) => ({
        [order.field]: order.direction.toLowerCase(),
      })),
    };

    try {
      return await prismaClient.post.findMany(query);
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async getPost(id: string) {
    try {
      const isSlug = Number.isNaN(parseInt(id, 10));
      const whereStatement: ObjectType = { deletedAt: null };

      if (isSlug) whereStatement.slug = { equals: id as string };
      else whereStatement.id = { equals: parseInt(id, 10) };

      return await prismaClient.post.findFirst({
        include: { PostAsset: true },
        where: whereStatement,
      });
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async updatePost(id: number, { assets, ...data }: ObjectType) {
    try {
      if (!id || !data) throw new BaseError();
      this.saveAssets(id, assets);
      return await prismaClient.post.update({ where: { id }, data });
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }

  async deletePost(id: number) {
    try {
      if (!id) throw new BaseError();

      return await prismaClient.post.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }
}

export default PostService.makeInstance();
