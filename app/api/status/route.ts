import StatusController from "@lib/controllers/StatusController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return StatusController.getAll(request);
}

export async function POST(request: NextRequest) {
  return StatusController.store(request);
}
