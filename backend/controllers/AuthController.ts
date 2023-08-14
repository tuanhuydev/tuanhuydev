import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectSchema, object, string } from 'yup';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';
import { ObjectType } from '@shared/interfaces/base';

import AuthService from '@backend/services/AuthService';
import Network from '@backend/utils/Network';

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
	async signIn(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		try {
			const { email, password } = await this.validateSignIn(req.body);

			const auth = await AuthService.signIn(email, password);
			if (!auth) throw new UnauthorizedError('Authenticate Failed');

			network.setCookie('jwt', auth.accessToken);

			return network.successResponse({ token: auth.refreshToken });
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
	async issueAccessToken(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		try {
			const { token } = req.body;
			const auth = await AuthService.issueAccessToken(token);
			return network.successResponse(auth);
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
		const { token } = req.body;
	}
}

export default new AuthController();
