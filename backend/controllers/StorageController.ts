import { NextApiRequest, NextApiResponse } from 'next';

import BaseError from '@shared/commons/errors/BaseError';

import S3Service from '@backend/services/S3Service';
import Network from '@backend/utils/Network';
import fileParser from '@backend/utils/fileParser';

class StorageController {
	async uploadFile(req: NextApiRequest, res: NextApiResponse) {
		const network = Network(req, res);
		const { type } = req.query;
		try {
			const { file } = await fileParser(req);
			const data: any = await S3Service.save(file, type as string);

			return network.successResponse({ url: data.Location });
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

export default new StorageController();
