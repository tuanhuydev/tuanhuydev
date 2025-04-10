import { NextRequest } from "next/server";
import SprintController from "server/controllers/SprintController";

export async function GET(request: NextRequest) {
  return SprintController.getAll(request);
}

export async function POST(request: NextRequest) {
  return SprintController.store(request);
}
