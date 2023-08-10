import type { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';

import PostController from '@backend/controllers/PostController';
import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handlePost = withAuthMiddleware(async (req: NextApiRequest, res: NextApiResponse) =>
	PostController.store(req, res)
);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET':
			return PostController.getAll(req, res);
		case 'POST':
			return handlePost(req, res);
		default:
			return res.status(HTTP_CODE.METHOD_NOT_ALLOWED_ERROR).end('Method not allowed');
	}
}
