import type { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';

import PostController from '@backend/controllers/PostController';

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
	switch (req.method) {
		case 'GET':
			return PostController.getOne(req, res);
		case 'PATCH':
			return PostController.update(req, res);
		case 'DELETE':
			return PostController.destroy(req, res);
		default:
			return res.status(HTTP_CODE.METHOD_NOT_ALLOWED_ERROR).end('Method not allowed');
	}
}
