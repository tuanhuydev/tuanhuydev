import { BaseController } from '@lib/shared/interfaces/controller';
import { NextRequest } from 'next/server';
import { ObjectSchema, object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import { ObjectType } from '@shared/interfaces/base';
import Network from '@shared/utils/Network';
import { makeSlug } from '@shared/utils/helper';

import postService from '@backend/services/PostService';

export class PostController implements BaseController {
	#schema: ObjectSchema<any>;

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

	async store(request: NextRequest, params: any) {
		const network = Network(request);
		try {
			const { assets = [], ...body } = await request.json();
			const validatedFields = await this.validateStoreRequest(body);

			validatedFields.slug = makeSlug(validatedFields.title);
			if (params) validatedFields.authorId = params.userId;

			const newPost = await postService.createPost(validatedFields);
			await postService.saveAssets(newPost.id, assets);

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
			const posts = await postService.getPosts(params);
			return network.successResponse(posts);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getOne(request: NextRequest, { id }: any) {
		const network = Network(request);
		try {
			if (!id) throw new BadRequestError();
			const postById = await postService.getPost(id);
			return network.successResponse(postById);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async update(request: NextRequest, { id }: any) {
		const body = await request.json();
		if (!id || !body) throw new BadRequestError();

		const network = Network(request);
		try {
			const updated = await postService.updatePost(Number(id), body);
			return network.successResponse(updated);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async delete(request: NextRequest, { id }: any) {
		if (!id) throw new BadRequestError();
		const network = Network(request);
		try {
			const deleted = await postService.deletePost(Number(id));
			return network.successResponse(deleted);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

const postController = new PostController();
export default postController;
