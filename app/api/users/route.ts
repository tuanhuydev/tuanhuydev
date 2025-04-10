import { NextRequest } from "next/server";
import UserController from "server/controllers/UserController";

export async function GET(request: NextRequest, { params }: any) {
  return UserController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
  return UserController.store(request, params);
}
