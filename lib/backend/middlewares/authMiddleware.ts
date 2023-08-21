import jwt from 'jsonwebtoken';
import Network from 'lib/backend/utils/Network';
import { ACCESS_TOKEN_SECRET } from 'lib/shared/commons/constants/encryption';
import BaseError from 'lib/shared/commons/errors/BaseError';
import UnauthorizedError from 'lib/shared/commons/errors/UnauthorizedError';
import { extractTokenFromRequest } from 'lib/shared/utils/network';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

const withAuthMiddleware = (handler: Function) => async (req: NextRequest, params: any) => {
	const network = Network(req);

	try {
		const authorization: string | null = headers().get('authorization');
		if (authorization) {
			const accessToken = extractTokenFromRequest(authorization);
			const secret = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
			const currentTimestamp = Math.floor(Date.now() / 1000);

			if (!secret || typeof secret !== 'object' || (secret?.exp as number) < currentTimestamp || !secret.userId) {
				throw new UnauthorizedError('Token expired');
			}

			return await handler(req, params);
		}
	} catch (error) {
		const isBaseError = error instanceof BaseError;
		return network.failResponse(isBaseError ? error : new BaseError((error as Error).message));
	}
};

export default withAuthMiddleware;
