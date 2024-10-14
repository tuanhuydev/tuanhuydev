export type JWTPayload = {
  userId: string;
  userEmail: string;
  iat: number;
  exp: number;
};
