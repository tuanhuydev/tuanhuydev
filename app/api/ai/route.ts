import AIController from "@server/controllers/AIController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return AIController.prompt(req);
}
