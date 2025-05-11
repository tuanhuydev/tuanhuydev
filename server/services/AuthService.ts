import { AUTH_URL, SALT_ROUNDS } from "@lib/commons/constants/base";
import BaseError from "@lib/commons/errors/BaseError";
import NotFoundError from "@lib/commons/errors/NotFoundError";
import bcrypt from "bcrypt";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import MongoUserRepository from "server/repositories/MongoUserRepository";
import { v4 as uuidv4 } from "uuid";

export type TokenPayload = {
  accessToken: string;
};
class AuthService {
  static #instance: AuthService;

  static makeInstance() {
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

  async getCurrentUserProfile() {
    try {
      const jwt = (await cookies()).get("jwt");
      if (!(jwt && "value" in jwt)) throw new BaseError("No JWT Cookie");

      const response = await fetch(`${AUTH_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${jwt.value}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new BaseError("Invalid token");
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
}

export default AuthService.makeInstance();
