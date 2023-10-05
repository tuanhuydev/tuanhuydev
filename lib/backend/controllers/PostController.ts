import { NextRequest } from 'next/server';
import { ObjectSchema, object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import { ObjectType } from '@shared/interfaces/base';
import { makeSlug } from '@shared/utils/helper';

import { BaseController } from '@backend/interfaces/controller';
import postService from '@backend/services/PostService';
import Network from '@backend/utils/Network';

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

	extractSearchParams(searchParams: URLSearchParams): ObjectType {
		const params: ObjectType = {};
		const numbericKeys = ['page', 'pageSize'];
		const booleanKeys = ['active'];

		for (let [key, values] of searchParams.entries()) {
			if (numbericKeys.includes(key)) params[key] = parseInt(values, 10);
			else if (booleanKeys.includes(key)) params[key] = Boolean(values === 'true');
		}
		return params;
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
			const { searchParams } = new URL(request.url);
			const params: ObjectType = this.extractSearchParams(searchParams);
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
