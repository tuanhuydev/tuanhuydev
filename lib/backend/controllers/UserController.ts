import { ObjectType } from '@lib/shared/interfaces/base';
import { NextRequest } from 'next/server';
import { ObjectSchema, object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';

import { BaseController } from '@backend/interfaces/controller';
import userService from '@backend/services/UserService';
import Network from '@backend/utils/Network';

import AuthService from '../services/AuthService';

class UserController implements BaseController {
	static #instance: UserController;
	#schema: ObjectSchema<any>;

	static makeInstance() {
		if (UserController.#instance) {
			return UserController.#instance;
		}
		return new UserController();
	}

	constructor() {
		this.#schema = object({
			name: string().max(50).required(),
			email: string().max(50).required(),
			password: string().required(),
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
			const body = await request.json();
			const validatedFields = await this.validateStoreRequest(body);
			const hashPassword = await AuthService.hashPassword(validatedFields.password);

			const newUser = await userService.createUser({
				...validatedFields,
				id: AuthService.issueID(),
				password: hashPassword,
			});

			return network.successResponse(newUser);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getAll(request: NextRequest) {
		const network = Network(request);
		try {
			const { searchParams } = new URL(request.url);
			const params: ObjectType = network.extractSearchParams(searchParams);

			const users = await userService.getUsers(params);
			return network.successResponse(users);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}

	async getOne(request: NextRequest, { id }: any) {
		// const network = Network(request);
		// try {
		// 	if (!id) throw new BadRequestError();
		// 	const postById = await userService.getPostById(Number(id));
		// 	return network.successResponse(postById);
		// } catch (error) {
		// 	return network.failResponse(error as BaseError);
		// }
	}

	async update(request: NextRequest, { id }: any) {
		// const body = await request.json();
		// if (!id || !body) throw new BadRequestError();
		// const network = Network(request);
		// try {
		// 	const updated = await userService.updatePost(Number(id), body);
		// 	return network.successResponse(updated);
		// } catch (error) {
		// 	return network.failResponse(error as BaseError);
		// }
	}

	async delete(request: NextRequest, { id }: any) {
		if (!id) throw new BadRequestError();
		const network = Network(request);
		try {
			const deleted = await userService.deleteUser(id);
			return network.successResponse(deleted);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

export default UserController.makeInstance();