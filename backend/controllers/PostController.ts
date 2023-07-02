import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import { object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import { makeSlug } from '@shared/utils/helper';

import { BaseController } from '@backend/interfaces/controller';
import postService from '@backend/services/PostService';
import Network from '@backend/utils/Network';
import { failResponse, successResponse } from '@backend/utils/http';

class PostController implements BaseController {
	#schema: yup.ObjectSchema<any>;

	constructor() {
		this.#schema = object({
			title: string().required(),
			content: string().required(),
		});
	}

	async validateStoreRequest(body: any) {
		try {
			return await this.#schema.validate(body);
		} catch (error) {
			throw new BadRequestError();
		}
	}

	async store(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		try {
			const validatedFields = await this.validateStoreRequest(req.body);
			validatedFields.slug = makeSlug(validatedFields.title);

			const newPost = await postService.createPost(validatedFields);
			return network.successResponse(newPost);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getAll(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		try {
			// TODO handle filter, pagination
			const posts = await postService.getPosts();
			return network.successResponse(posts);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getOne(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		try {
			const { id } = req.query;
			if (!id) throw new BadRequestError();

			const postById = await postService.getPost(Number(id));
			return network.successResponse(postById);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async update(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);

		try {
			const { query, body } = req;
			if (!query?.id || !body) throw new BadRequestError();

			const updated = await postService.updatePost(Number(query.id), body);
			return network.successResponse(updated);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async destroy(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		try {
			if (!req.query?.id) throw new BadRequestError();

			const deleted = await postService.deletePost(Number(req.query.id));
			return network.successResponse(deleted);
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}
}

export default new PostController();
