import { NextRequest } from "next/server";
import SprintController from "server/controllers/SprintController";

export async function GET(request: NextRequest, { params }: any) {
  return SprintController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return SprintController.update(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return SprintController.destroy(request, params);
}
