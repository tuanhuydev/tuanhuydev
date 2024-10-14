import UserController from "@lib/controllers/UserController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return UserController.getAll(request);
}

export async function POST(request: NextRequest, { params }: any) {
  return UserController.store(request, params);
}
