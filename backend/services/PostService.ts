import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';

import prismaClient from '@backend/database/prismaClient';

class PostService {
	async createPost(body: any) {
		try {
			if (!body) throw new BaseError();

			return await prismaClient.post.create({
				data: {
					...body,
					authorId: '2e633db0-dc69-11ed-afa1-0242ac120002',
				},
			});
		} catch (error) {
			throw new BaseError('Unable to create post');
		}
	}

	async getPosts() {
		try {
			return await prismaClient.post.findMany({ where: { deletedAt: null } });
		} catch (error) {
			throw new BaseError('Unable to get posts');
		}
	}

	async getPost(id: number) {
		try {
			return await prismaClient.post.findFirst({ where: { id } });
		} catch (error) {
			throw new BaseError('Unable to get post');
		}
	}

	async updatePost(id: number, data: Object) {
		try {
			if (!id || !data) throw new BaseError();
			return await prismaClient.post.update({ where: { id }, data });
		} catch (error) {
			throw new BaseError('Unable to update post');
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
			throw new BaseError('Unable to update post');
		}
	}
}

export default new PostService();
