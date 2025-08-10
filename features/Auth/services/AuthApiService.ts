import { BASE_URL } from "@lib/commons/constants/base";
import BaseError from "@lib/commons/errors/BaseError";

/**
 * Auth service functions that don't depend on React hooks
 * This breaks the circular dependency between useSession and authQueries
 */
export class AuthApiService {
  /**
   * Sign out user by calling the API
   */
  static async signOut(): Promise<Response> {
    const response = await fetch(`${BASE_URL}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new BaseError(`Sign out failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * Check if a token is valid format (basic validation)
   */
  static isValidTokenFormat(token: string): boolean {
    return typeof token === "string" && token.length > 0 && !token.includes(" ");
  }

  /**
   * Extract error message from response
   */
  static async extractErrorMessage(response: Response): Promise<string> {
    try {
      const errorData = await response.json();
      return errorData.message || errorData.error || response.statusText;
    } catch {
      return response.statusText;
    }
  }
}

export default AuthApiService;
