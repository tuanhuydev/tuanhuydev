import { NextRequest } from 'next/server';
import { ObjectSchema, object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';
import Network from '@shared/utils/Network';

import AuthService from '@backend/services/AuthService';

class AuthController {
	#signInSchema: ObjectSchema<any>;

	constructor() {
		this.#signInSchema = object({
			email: string().required(),
			password: string().required(),
		});
	}

	async validateSignIn(body: any) {
		try {
			return this.#signInSchema.validate(body);
		} catch (error) {
			throw new BadRequestError();
		}
	}
	async signIn(request: NextRequest) {
		const network = Network(request);
		try {
			const body = await request.json();
			const { email, password } = await this.validateSignIn(body);
			const auth = await AuthService.signIn(email, password);
			if (!auth) throw new UnauthorizedError('Authenticate Failed');
			return network.successResponse(auth);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
	async issueAccessToken(request: NextRequest) {
		const network = Network(request);
		try {
			const { token } = await request.json();
			const auth = await AuthService.issueAccessToken(token);

			return network.successResponse(auth);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

const authController = new AuthController();
export default authController;
