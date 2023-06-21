import type { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';
import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';

import AuthService from '@backend/services/AuthService';

class AuthController {
	async signIn(req: NextApiRequest, res: NextApiResponse) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new BadRequestError();
			}

			const auth = await AuthService.signIn(email, password);
			return res.status(HTTP_CODE.SUCCESS).json(auth);
		} catch (error) {
			if (error instanceof BaseError) return (error as BaseError).getApiResponse(res);
			return res.status(HTTP_CODE.INTERNAL_ERROR).json(error);
		}
	}
}

export default new AuthController();
