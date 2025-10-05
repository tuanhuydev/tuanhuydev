export interface JWTPlayload extends Timestamps {
  id: string;
  name: string;
  email: string;
  permissionId: string;
  iat: number;
  exp: number;
}
