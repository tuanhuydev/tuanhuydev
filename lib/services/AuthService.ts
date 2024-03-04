import { NODE_ENV, SALT_ROUNDS } from "@lib/configs/constants";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import { User } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import { ACCESS_TOKEN_LIFE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@shared/commons/constants/encryption";
import BaseError from "@shared/commons/errors/BaseError";
import NotFoundError from "@shared/commons/errors/NotFoundError";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";

class AuthService {
  static #instance: AuthService;

  static makeInstance() {
    // Implement Singleton
    if (AuthService.#instance) {
      return AuthService.#instance;
    }
    return new AuthService();
  }

  issueID() {
    return uuidv4();
  }

  async hashPassword(plainPassword: string) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainPassword, SALT_ROUNDS, function (error, hash) {
        if (error) reject(new BaseError((error as Error).message));
        resolve(hash);
      });
    });
  }

  async validateSignIn(email: string, password: string) {
    const userByEmail = await prismaClient.user.findUnique({ where: { email } });

    if (!userByEmail) throw new NotFoundError("Invalid user");

    if (!bcrypt.compareSync(password, userByEmail.password)) throw new BaseError("Invalid credential");

    return userByEmail;
  }

  async issueAccessToken(token: string) {
    try {
      const { payload } = await jose.jwtVerify(token, REFRESH_TOKEN_SECRET);
      if (!payload) throw new UnauthorizedError("Invalid JWT");

      const { userId, userEmail } = payload as { userId: string; userEmail: string };
      const validUser = await prismaClient.user.findFirst({ where: { id: userId, email: userEmail } });

      if (!validUser) throw new UnauthorizedError("Invalid JWT");

      const accessToken = await new jose.SignJWT({ userId, userEmail })
        .setExpirationTime(ACCESS_TOKEN_LIFE)
        .setProtectedHeader({ alg: "HS256" })
        .sign(ACCESS_TOKEN_SECRET);

      return accessToken;
    } catch (error: any) {
      throw new UnauthorizedError((error as Error).message);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { id: userId, email: userEmail }: User = await this.validateSignIn(email, password);
      const accessToken = await new jose.SignJWT({ userId, userEmail })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(ACCESS_TOKEN_SECRET);

      const refreshToken = await new jose.SignJWT({ userId, userEmail })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .setIssuedAt()
        .sign(REFRESH_TOKEN_SECRET);
      return { userId, accessToken, refreshToken };
    } catch (error) {
      if (NODE_ENV !== "production") console.error(error);
    }
  }

  forgotPassword(email: string) {
    //TODO: verify email exist and handle forgot password link
  }
  resetPassword(token: string) {
    //TODO: handle reset password here
  }
}

export default AuthService.makeInstance();
