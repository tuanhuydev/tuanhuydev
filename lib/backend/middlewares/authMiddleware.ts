import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { ACCESS_TOKEN_SECRET } from '@shared/commons/constants/encryption';
import BaseError from '@shared/commons/errors/BaseError';
import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';
import { extractTokenFromRequest } from '@shared/utils/network';

import Network from '@backend/utils/Network';

const withAuthMiddleware =
	(handler: Function) =>
	async (req: NextRequest, params: any = {}) => {
		const network = Network(req);
		try {
			const authorization: string | null = headers().get('authorization');
			if (!authorization) throw new UnauthorizedError('Token not found');

			const accessToken = extractTokenFromRequest(authorization);
			const secret = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
			const currentTimestamp = Math.floor(Date.now() / 1000);

			const invalidSecret = !secret || typeof secret !== 'object' || !secret.userId;
			const isTokenExpired = invalidSecret || (secret?.exp as number) < currentTimestamp;
			if (isTokenExpired) throw new UnauthorizedError('Token expired');

			return await handler(req, { ...params, userId: secret.userId });
		} catch (error) {
			const isBaseError = error instanceof BaseError;
			return network.failResponse(isBaseError ? error : new BaseError((error as Error).message));
		}
	};

export default withAuthMiddleware;
