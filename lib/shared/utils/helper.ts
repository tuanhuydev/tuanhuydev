import UnauthorizedError from '@lib/shared/commons/errors/UnauthorizedError';

export const transformTextToDashed = (text: string) => {
	// clear space
	let dashedText = text.toLowerCase().trim();

	// Remove all special characters
	dashedText = dashedText.replace(/[^\w\s]/g, '-');

	// Replace space to dash(-)
	dashedText = dashedText.replace(/\s+/g, '-');
	return dashedText;
};

export const makeRandomTextByLength = (length: number) => {
	let randomText = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomText += characters.charAt(randomIndex);
	}

	return randomText;
};

export const makeSlug = (text: string) => {
	const hashedLength = 6;
	return text.concat(`-${makeRandomTextByLength(hashedLength)}`);
};

export const isURLValid = (url: string) => {
	if (!url || typeof url !== 'string') return false;
	return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://');
};

export const extractTokenFromRequest = (bearerString: string) => {
	const bearerPrefixLength = 7;

	if (!bearerString || !bearerString.startsWith('Bearer ')) throw new UnauthorizedError('Token missing');

	const token = bearerString.substring(bearerPrefixLength);
	return token;
};

export const isPathActive = (pathName: string, path: string) => {
	if (!pathName || !path) return false;
	return (pathName as string).startsWith(path);
};
