export const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "accesstoken");

export const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET || "refreshtoken");

export const ACCESS_TOKEN_LIFE: string = process.env.ACCESS_TOKEN_LIFE || "20s";

export const REFRESH_TOKEN_LIFE: string = process.env.REFRESH_TOKEN_LIFE || "1h";
