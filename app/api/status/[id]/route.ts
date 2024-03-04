import StatusController from "@lib/controllers/StatusController";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: any) {
  return StatusController.update(request, params);
}

export async function DELETE(request: NextRequest, { params }: any) {
  return StatusController.delete(request, params);
}

export async function GET(request: NextRequest, { params }: any) {
  return StatusController.getOne(request, params);
}
