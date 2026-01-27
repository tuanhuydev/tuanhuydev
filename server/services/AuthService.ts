import { AUTH_URL, SALT_ROUNDS } from "@lib/commons/constants/base";
import BaseError from "@lib/commons/errors/BaseError";
import NotFoundError from "@lib/commons/errors/NotFoundError";
import { User } from "@lib/types/user";
import { userRepository } from "@server/repositories/MongoUserRepository";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export type TokenPayload = {
  accessToken: string;
};

export class AuthService {
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

  async hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(plainPassword, SALT_ROUNDS, function (error, hash) {
        if (error) reject(new BaseError(error.message));
        resolve(hash);
      });
    });
  }

  async validateSignIn(email: string, password: string): Promise<User> {
    const user = (await userRepository.findOneByEmail(email)) as User | null;
    if (!user) throw new NotFoundError("Invalid user");

    if (!bcrypt.compareSync(password, user.password)) throw new BaseError("Invalid credential");

    return user;
  }

  async getCurrentUserProfile(): Promise<User | null> {
    try {
      const jwt = (await cookies()).get("jwt");
      if (!jwt?.value) throw new BaseError("No JWT Cookie");
      const response = await fetch(`${AUTH_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${jwt.value}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new BaseError("Invalid token");
      return response.json() as Promise<User>;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const authService = AuthService.makeInstance();
