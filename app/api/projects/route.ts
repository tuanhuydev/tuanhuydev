import ProjectController from "@lib/controllers/ProjectController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return ProjectController.getAll(request);
}

export async function POST(request: NextRequest) {
  return ProjectController.store(request);
}
