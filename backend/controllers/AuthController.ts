import AuthService from '@backend/services/AuthService';
import { HTTP_CODE } from '@shared/commons/constants/httpCode';
import NotFoundError from '@shared/commons/errors/NotFoundError';
import type { NextApiRequest, NextApiResponse } from 'next';

class AuthController {
	async signIn(req: NextApiRequest, res: NextApiResponse) {
		try {
			const { email, password } = req.body;
			const auth = await AuthService.signIn(email, password);
			return res.status(HTTP_CODE.SUCCESS).json(auth);
		} catch (error) {
			console.log(error);
			return (error as NotFoundError)?.getApiResponse(res);
		}
	}
}

export default new AuthController();
