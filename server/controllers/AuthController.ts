import { AUTH_URL, isProductionEnv } from "@lib/commons/constants/base";
import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import Network from "@lib/utils/network";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ObjectSchema, object, string } from "yup";

class AuthController {
  #signInSchema: ObjectSchema<{ email: string; password: string }>;

  constructor() {
    this.#signInSchema = object({
      email: string().required(),
      password: string().required(),
    });
  }

  async validateSignIn(body: unknown) {
    try {
      return this.#signInSchema.validate(body);
    } catch {
      throw new BadRequestError();
    }
  }

  async signIn(request: NextRequest) {
    const network = new Network(request);
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

      const { accessToken } = (await signInResponse.json()) as { accessToken: string };
      if (!accessToken) throw new UnauthorizedError("Authenticate Failed");

      (await cookies()).set("jwt", accessToken, {
        sameSite: "strict",
        httpOnly: true,
        secure: isProductionEnv,
      });
      return network.successResponse({ accessToken });
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async signOut(request: NextRequest) {
    const network = new Network(request);
    (await cookies()).delete("jwt");
    return network.successResponse({ message: "Sign out successfully" });
  }
}

const authController = new AuthController();
export default authController;
