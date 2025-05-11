import { NextRequest } from "next/server";
import AuthController from "server/controllers/AuthController";

export async function POST(req: NextRequest) {
  return AuthController.signOut(req);
}
