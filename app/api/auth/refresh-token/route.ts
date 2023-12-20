import AuthController from "@backend/controllers/AuthController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return AuthController.issueAccessToken(req);
}
