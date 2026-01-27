import { userController } from "@server/controllers/UserController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return userController.getAll(request);
}

export async function POST(request: NextRequest) {
  return userController.store(request);
}
