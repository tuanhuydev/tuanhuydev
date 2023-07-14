export const transformTextToDashed = (text: string) => {
	// clear space
	let dashedText = text.toLowerCase().trim();

	// Remove all special characters
	// dashedText = dashedText.replace(/[^\w\s]/g, '');

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
	return transformTextToDashed(text).concat(`-${makeRandomTextByLength(hashedLength)}`);
};
