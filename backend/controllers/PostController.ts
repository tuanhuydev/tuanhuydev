import { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import { object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import { makeSlug } from '@shared/utils/helper';

import { BaseController } from '@backend/interfaces/controller';
import postService from '@backend/services/PostService';
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
		if (!body) throw new BadRequestError();
		return await this.#schema.validate(body);
	}

	async store(req: NextApiRequest, res: NextApiResponse) {
		try {
			const validatedFields = await this.validateStoreRequest(req.body);
			validatedFields.slug = makeSlug(validatedFields.title);

			const newPost = await postService.createPost(validatedFields);

			return res.json(successResponse(newPost));
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}

	async getAll(req: NextApiRequest, res: NextApiResponse) {
		try {
			// TODO handle filter, pagination
			const posts = await postService.getPosts();
			return res.json(successResponse(posts));
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}

	async getOne(req: NextApiRequest, res: NextApiResponse) {
		try {
			const { id } = req.query;
			if (!id) throw new BadRequestError();

			const post = await postService.getPost(Number(id));
			return res.json(successResponse(post));
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}

	async update({ query, body }: NextApiRequest, res: NextApiResponse) {
		try {
			const { id } = query;
			if (!id || !body) throw new BadRequestError();
			const updated = await postService.updatePost(Number(id), body);
			return res.json(successResponse(updated));
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}

	async destroy({ query }: NextApiRequest, res: NextApiResponse) {
		try {
			const { id } = query;
			if (!id) throw new BadRequestError();
			const deleted = await postService.deletePost(Number(id));
			return res.json(successResponse(deleted));
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}
}

export default new PostController();
