export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "accesstoken");

export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "15m";
