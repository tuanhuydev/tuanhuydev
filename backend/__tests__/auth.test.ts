import { NextApiRequest, NextApiResponse } from 'next';

import AuthController from '@backend/controllers/AuthController';
import { failResponse } from '@backend/utils/http';

describe('Authenticate feature API test suit', function () {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Sign in API', () => {
		it('Should throw error by email and password', async () => {
			const req: NextApiRequest = { body: { email: 'abc@email.com' } } as any;
			const res: NextApiResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
			await AuthController.signIn(req, res);
			expect(res.json).toHaveBeenCalledWith(failResponse('password is a required field'));
		});
	});
});
