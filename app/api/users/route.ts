import { NextRequest } from "next/server";
import UserController from "server/controllers/UserController";

export async function GET(request: NextRequest) {
  return UserController.getAll(request);
}

export async function POST(request: NextRequest) {
  return UserController.store(request);
}
