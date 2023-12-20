export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesstoken";

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshtoken";

export const ACCESS_TOKEN_LIFE = parseInt(process.env.ACCESS_TOKEN_LIFE as string, 10) ?? 3600;

export const REFRESH_TOKEN_LIFE = parseInt(process.env.REFRESH_TOKEN_LIFE as string, 10) ?? 7200;
