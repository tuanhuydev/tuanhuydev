import AIController from "@server/controllers/AIController";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return AIController.prompt(req);
}
