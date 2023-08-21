import UnauthorizedError from 'lib/shared/commons/errors/UnauthorizedError';

export const extractTokenFromRequest = (bearerString: string) => {
	const bearerPrefixLength = 7;

	if (!bearerString || !bearerString.startsWith('Bearer ')) throw new UnauthorizedError('Token missing');

	const token = bearerString.substring(bearerPrefixLength);
	return token;
};
