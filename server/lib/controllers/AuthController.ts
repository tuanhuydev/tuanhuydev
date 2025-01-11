import { AUTH_URL } from "@lib/configs/constants";
import BadRequestError from "@lib/shared/commons/errors/BadRequestError";
import BaseError from "@lib/shared/commons/errors/BaseError";
import UnauthorizedError from "@lib/shared/commons/errors/UnauthorizedError";
import Network from "@lib/shared/utils/network";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ObjectSchema, object, string } from "yup";

class AuthController {
  #signInSchema: ObjectSchema<any>;

  constructor() {
    this.#signInSchema = object({
      email: string().required(),
      password: string().required(),
    });
  }

  async validateSignIn(body: any) {
    try {
      return this.#signInSchema.validate(body);
    } catch (error) {
      throw new BadRequestError();
    }
  }

  async signIn(request: NextRequest) {
    const network = Network(request);
    try {
      if (!AUTH_URL) throw new BaseError("Auth URL is not defined");

      const body = await network.getBody();
      const { email, password } = await this.validateSignIn(body);

      const signInResponse = await fetch(`${AUTH_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!signInResponse.ok) throw new UnauthorizedError("Authenticate Failed");

      const { accessToken } = await signInResponse.json();
      if (!accessToken) throw new UnauthorizedError("Authenticate Failed");

      cookies().set("jwt", accessToken, { sameSite: "strict", httpOnly: true });
      return network.successResponse({ accessToken });
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async signOut(request: NextRequest) {
    cookies().delete("jwt");
    return Network(request).successResponse({ message: "Sign out successfully" });
  }
}

const authController = new AuthController();
export default authController;
