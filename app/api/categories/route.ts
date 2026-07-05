import { NextRequest } from "next/server";
import { categoryController } from "server/controllers/CategoryController";

export async function GET(request: NextRequest) {
  return categoryController.getAll(request);
}

export async function POST(request: NextRequest) {
  return categoryController.store(request);
}
