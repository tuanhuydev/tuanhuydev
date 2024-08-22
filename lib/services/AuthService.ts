import { SALT_ROUNDS } from "@lib/configs/constants";
import MongoUserRepository from "@lib/repositories/MongoUserRepository";
import {
  ACCESS_TOKEN_LIFE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
} from "@lib/shared/commons/constants/encryption";
import BaseError from "@lib/shared/commons/errors/BaseError";
import NotFoundError from "@lib/shared/commons/errors/NotFoundError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";

export type TokenPayload = {
  accessToken: string;
  refreshToken: string;
};
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
    const userByEmail = await MongoUserRepository.getUserByEmail(email);
    if (!userByEmail) throw new NotFoundError("Invalid user");

    if (!bcrypt.compareSync(password, userByEmail.password)) throw new BaseError("Invalid credential");

    return userByEmail;
  }

  async issueAccessToken(token: string) {
    try {
      const { payload } = await jose.jwtVerify(token, REFRESH_TOKEN_SECRET);
      if (!payload) throw new UnauthorizedError("Invalid JWT");

      const { userId, userEmail } = payload as { userId: string; userEmail: string };
      const validUser = await MongoUserRepository.getUser(userId);

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

  async signIn(email: string, password: string): Promise<TokenPayload | null> {
    const { _id: userId, email: userEmail } = await this.validateSignIn(email, password);
    const accessToken = await new jose.SignJWT({ userId, userEmail })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(ACCESS_TOKEN_LIFE)
      .sign(ACCESS_TOKEN_SECRET);

    const refreshToken = await new jose.SignJWT({ userId, userEmail })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(REFRESH_TOKEN_LIFE)
      .setIssuedAt()
      .sign(REFRESH_TOKEN_SECRET);
    return { accessToken, refreshToken };
  }

  forgotPassword(email: string) {
    //TODO: verify email exist and handle forgot password link
  }
  resetPassword(token: string) {
    //TODO: handle reset password here
  }
}

export default AuthService.makeInstance();
