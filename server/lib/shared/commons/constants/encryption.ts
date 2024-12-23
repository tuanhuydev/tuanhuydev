export const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "accesstoken");

export const ACCESS_TOKEN_LIFE: string = process.env.ACCESS_TOKEN_LIFE || "15m";
