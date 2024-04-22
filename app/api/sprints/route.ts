import SprintController from "@lib/controllers/SprintController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return SprintController.getAll(request);
}

export async function POST(request: NextRequest) {
  return SprintController.store(request);
}
