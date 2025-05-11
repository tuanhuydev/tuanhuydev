import UnauthorizedError from "lib/commons/errors/UnauthorizedError";
import { NextRequest } from "next/server";

export const extractBearerToken = (request: NextRequest) => {
  const header = request.headers.get("Authorization");
  if (!header) throw new UnauthorizedError("No Authorization Header");

  const token = header.split(/\s+/)[1];
  if (!token) throw new UnauthorizedError("No Token");

  return token;
};
