import AuthService, { TokenPayload } from "@lib/services/AuthService";
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
      const body = await network.getBody();
      const { email, password } = await this.validateSignIn(body);
      const auth: TokenPayload | null = await AuthService.signIn(email, password);

      if (!auth) throw new UnauthorizedError("Authenticate Failed");
      const { accessToken } = auth;
      cookies().set("jwt", accessToken, { sameSite: "strict", httpOnly: true });
      return network.successResponse({ accessToken });
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async signOut(request: NextRequest) {
    cookies().delete("jwt");
    return Network(request).successResponse({ message: "Sign out successfully" });
  }

  async issueAccessToken(request: NextRequest) {
    const network = Network(request);
    try {
      const token: string | undefined = cookies().get("jwt")?.value;
      if (!token) throw new UnauthorizedError("Unauthorized");
      const auth = await AuthService.issueAccessToken(token);
      return network.successResponse(auth);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

const authController = new AuthController();
export default authController;
