import prismaClient from '@prismaClient/prismaClient';

import BaseError from '@shared/commons/errors/BaseError';
import { ObjectType } from '@shared/interfaces/base';

export type PostFilter = {
	page?: number;
	pageSize?: number;
	active?: boolean;
	search?: string;
	orderBy?: ObjectType[];
};

class PostService {
	static #instance: PostService;

	static makeSingleton() {
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

	async getPosts(filter?: PostFilter) {
		let defaultWhere: ObjectType = { deletedAt: null };
		if (!filter) return await prismaClient.post.findMany({ where: defaultWhere });
		const {
			page = 1,
			pageSize = 10,
			active = true,
			orderBy = [{ field: 'createdAt', direction: 'desc' }],
			search = '',
		} = filter;

		if (search) {
			defaultWhere = {
				...defaultWhere,
				title: {
					contains: search,
				},
			};
		}
		if (orderBy.length) {
		}

		let query: any = {
			where: {
				deletedAt: null,
				title: {
					contains: search,
				},
			},
			take: pageSize,
			skip: (page - 1) * pageSize,
			orderBy: orderBy.map((order) => ({
				[order.field]: order.direction.toLowerCase(),
			})),
		};
		if (active) {
			query.where = {
				...query.where,
				publishedAt: {
					not: null,
				},
			};
		}
		try {
			return await prismaClient.post.findMany(query);
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async getPostById(id: number) {
		try {
			return await prismaClient.post.findFirst({ where: { id, deletedAt: null } });
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async getPostBySlug(slug: string) {
		try {
			return await prismaClient.post.findFirst({
				where: {
					slug,
					deletedAt: null,
					publishedAt: {
						not: null,
					},
				},
			});
		} catch (error) {
			throw new BaseError((error as Error).message);
		}
	}

	async updatePost(id: number, data: Object) {
		try {
			if (!id || !data) throw new BaseError();
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

export default PostService.makeSingleton();
