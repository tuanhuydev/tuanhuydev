export const ACCESS_TOKEN_SECRET =
	process.env.ACCESS_TOKEN_SECRET || 'accesstoken';
export const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || 60 * 60;
export const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || 'refreshtoken';
export const REFRESH_TOKEN_LIFE =
	process.env.REFRESH_TOKEN_LIFE || 60 * 60 * 60;
