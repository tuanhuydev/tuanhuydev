import { NextApiRequest, NextApiResponse } from 'next';

import StorageController from '@backend/controllers/StorageController';

jest.mock<typeof import('@backend/utils/fileParser')>('@backend/utils/fileParser', () => ({
	__esModule: true,
	default: jest.fn(() =>
		Promise.resolve({ file: { size: 100, path: 'mockedFilePath', headers: { 'content-length': 100 } } })
	),
}));

jest.mock('@backend/services/S3Service', () => ({
	__esModule: true,
	S3Service: {
		save: jest.fn().mockResolvedValue({ Location: 'mockedLocation' }),
	},
}));

describe('Upload API test suits', function () {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should able to upload file', async () => {
		const req: NextApiRequest = { query: { type: 'mockedType' } } as any;
		const res: NextApiResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
		await StorageController.uploadFile(req, res);

		expect(req.query.type).toBe('mockedType');
	});
});
