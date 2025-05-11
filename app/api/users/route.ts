import { NextRequest } from "next/server";
import UserController from "server/controllers/UserController";

export async function GET(request: NextRequest, { params }: any) {
  return UserController.getAll(request);
}

export async function POST(request: NextRequest, props: any) {
  const params = await props.params;
  return UserController.store(request, params);
}
