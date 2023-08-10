import type { NextApiRequest, NextApiResponse } from 'next';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';

import PostController from '@backend/controllers/PostController';
import withAuthMiddleware from '@backend/middlewares/authMiddleware';

const handleUpdate = withAuthMiddleware(async (req: NextApiRequest, res: NextApiResponse) =>
	PostController.update(req, res)
);

const handleDelete = withAuthMiddleware(async (req: NextApiRequest, res: NextApiResponse) =>
	PostController.delete(req, res)
);

export default function handler(req: NextApiRequest, res: NextApiResponse<string>) {
	switch (req.method) {
		case 'GET':
			return PostController.getOne(req, res);
		case 'PATCH':
			return handleUpdate(req, res);
		case 'DELETE':
			return handleDelete(req, res);
		default:
			return res.status(HTTP_CODE.METHOD_NOT_ALLOWED_ERROR).end('Method not allowed');
	}
}
