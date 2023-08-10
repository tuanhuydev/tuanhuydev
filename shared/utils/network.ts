import { NextApiRequest } from 'next';

import UnauthorizedError from '@shared/commons/errors/UnauthorizedError';

export const extractTokenFromRequest = (req: NextApiRequest) => {
	const authorizedHeader = req.headers['authorization'];
	const bearerPrefixLength = 7;

	if (!authorizedHeader || !authorizedHeader.startsWith('Bearer ')) throw new UnauthorizedError('Token missing');

	const token = authorizedHeader.substring(bearerPrefixLength);
	return token;
};
