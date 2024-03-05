import AuthController from "@lib/controllers/AuthController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return AuthController.signIn(req);
}
