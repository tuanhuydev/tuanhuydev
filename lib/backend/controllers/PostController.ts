import { BaseController } from 'lib/backend/interfaces/controller';
import postService from 'lib/backend/services/PostService';
import Network from 'lib/backend/utils/Network';
import BadRequestError from 'lib/shared/commons/errors/BadRequestError';
import BaseError from 'lib/shared/commons/errors/BaseError';
import { makeSlug } from 'lib/shared/utils/helper';
import { NextRequest } from 'next/server';
import { ObjectSchema, object, string } from 'yup';

class PostController implements BaseController {
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

	async store(request: NextRequest) {
		const network = Network(request);

		try {
			const body = await request.json();
			const validatedFields = await this.validateStoreRequest(body);
			validatedFields.slug = makeSlug(validatedFields.title);

			const newPost = await postService.createPost(validatedFields);
			return network.successResponse(newPost);
		} catch (error) {
			console.error(error);
			return network.failResponse(error as BaseError);
		}
	}

	async getAll(request: NextRequest) {
		const network = Network(request);
		try {
			// TODO handle filter, pagination
			const posts = await postService.getPosts();
			return network.successResponse(posts);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getOne(request: NextRequest, { id }: any) {
		const network = Network(request);
		try {
			if (!id) throw new BadRequestError();

			const postById = await postService.getPostById(Number(id));
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
