import AuthController from "@lib/controllers/AuthController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return AuthController.issueAccessToken(request);
}
