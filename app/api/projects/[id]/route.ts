import ProjectController from "@lib/controllers/ProjectController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: any) {
  return ProjectController.getOne(request, params);
}

export async function PATCH(request: NextRequest, { params }: any) {
  return ProjectController.update(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return ProjectController.delete(request, params);
}
