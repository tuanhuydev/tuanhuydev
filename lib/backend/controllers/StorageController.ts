import { NextRequest } from 'next/server';

import BaseError from '@shared/commons/errors/BaseError';

import S3Service from '@backend/services/S3Service';
import Network from '@backend/utils/Network';

class StorageController {
	async uploadFile(request: NextRequest, { type }: any) {
		const network = Network(request);
		try {
			const formData = await request.formData();
			const file = formData.get('file') as unknown;
			if (!file) throw new BaseError('Invalid File');
			const data: any = await S3Service.save(file as File, type as string);
			return network.successResponse({ url: data.Location });
		} catch (error) {
			return network.failResponse(error as BaseError);
		}
	}
}

const storageController = new StorageController();
export default storageController;
