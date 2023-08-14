import type { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';

import AuthController from '@backend/controllers/AuthController';

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
	switch (req.method) {
		case 'POST':
			return AuthController.issueAccessToken(req, res);
		default:
			return res.status(HTTP_CODE.METHOD_NOT_ALLOWED_ERROR).end('Method not allowed');
	}
}
