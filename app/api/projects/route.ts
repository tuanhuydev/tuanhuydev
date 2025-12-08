import { NextRequest } from "next/server";
import ProjectController from "server/controllers/ProjectController";

export async function GET(request: NextRequest) {
  return ProjectController.getAll(request);
}

export async function POST(request: NextRequest) {
  return ProjectController.store(request);
}
