import type { NextApiRequest, NextApiResponse, PageConfig } from 'next';

import { HTTP_CODE } from '@shared/commons/constants/httpCode';

import storageController from '@backend/controllers/StorageController';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
	//TODO: Apply middleware
	switch (req.method) {
		case 'POST':
			return storageController.uploadFile(req, res);
		default:
			return res.status(HTTP_CODE.METHOD_NOT_ALLOWED_ERROR).end('Method not allowed');
	}
}

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};
