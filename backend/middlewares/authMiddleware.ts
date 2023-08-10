import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import { ACCESS_TOKEN_SECRET } from '@shared/commons/constants/encryption';
import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';

import Network from '@backend/utils/Network';

const withAuthMiddleware = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
	const network = Network(req, res);

	try {
		const authorizedHeader = req.headers['authorization'];
		const bearerPrefixLength = 7;

		if (!authorizedHeader || !authorizedHeader.startsWith('Bearer ')) throw new UnauthorizedError('Token missing');

		const accessToken = authorizedHeader.substring(bearerPrefixLength);
		const secret = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

		const currentTimestamp = Math.floor(Date.now() / 1000);
		if (typeof secret !== 'object' || (secret?.exp as number) < currentTimestamp || !secret.userId) {
			throw new UnauthorizedError('Token expired');
		}

		return await handler(req, res);
	} catch (error) {
		const isBaseError = error instanceof BaseError;
		return network.failResponse(isBaseError ? error : new BaseError((error as Error).message));
	}
};

export default withAuthMiddleware;
