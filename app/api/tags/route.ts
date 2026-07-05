import { NextRequest } from "next/server";
import { tagController } from "server/controllers/TagController";

export async function GET(request: NextRequest) {
  return tagController.getAll(request);
}

export async function POST(request: NextRequest) {
  return tagController.store(request);
}
