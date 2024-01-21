import { EMPTY_STRING, NODE_ENV, SALT_ROUNDS } from "@lib/configs/constants";
import { User } from "@prisma/client";
import prismaClient from "@prismaClient/prismaClient";
import {
  ACCESS_TOKEN_LIFE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
} from "@shared/commons/constants/encryption";
import BaseError from "@shared/commons/errors/BaseError";
import NotFoundError from "@shared/commons/errors/NotFoundError";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
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
    return new Promise((resolve, reject) => {
      jwt.verify(token, REFRESH_TOKEN_SECRET, { ignoreExpiration: true }, async (err, decoded) => {
        if (err || typeof decoded === "string") reject(new BaseError("Invalid Token"));
        const { userId, userEmail } = (decoded as ObjectType) || { userId: EMPTY_STRING, userEmail: EMPTY_STRING };
        const validUser = await prismaClient.user.findFirst({ where: { id: userId, email: userEmail } });

        if (!validUser) reject(new BaseError("Invalid Token"));
        const accessToken = jwt.sign({ userId, userEmail }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
        resolve(accessToken);
      });
    });
  }

  async signIn(email: string, password: string) {
    try {
      const { id: userId, email: userEmail }: User = await this.validateSignIn(email, password);
      const accessToken = jwt.sign({ userId, userEmail }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
      const refreshToken = jwt.sign({ userId, userEmail }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });

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
