import BaseError from '@shared/commons/errors/BaseError';

import prismaClient from '@backend/database/prismaClient';

class PostService {
	async createPost(body: any) {
		try {
			const newPostData = {
				...body,
				authorId: '2e633db0-dc69-11ed-afa1-0242ac120002',
			};
			return await prismaClient.post.create({ data: newPostData });
		} catch (error: any) {
			throw new BaseError((error as Error).message);
		}
	}

	async getPosts() {
		try {
			return await prismaClient.post.findMany({ where: { deletedAt: null } });
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

export default new PostService();
