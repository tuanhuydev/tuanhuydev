import type { NextApiRequest, NextApiResponse } from 'next';

import BadRequestError from '@shared/commons/errors/BadRequestError';
import BaseError from '@shared/commons/errors/BaseError';

import AuthService from '@backend/services/AuthService';
import { failResponse } from '@backend/utils/http';

class AuthController {
	async signIn(req: NextApiRequest, res: NextApiResponse) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				throw new BadRequestError();
			}

			const auth = await AuthService.signIn(email, password);
			return res.json(auth);
		} catch (error) {
			return res.json(failResponse((error as BaseError).message));
		}
	}
}

export default new AuthController();
