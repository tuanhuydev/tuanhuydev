import { NextRequest } from "next/server";
import { seriesController } from "server/controllers/SeriesController";

export async function GET(request: NextRequest) {
  return seriesController.getAll(request);
}

export async function POST(request: NextRequest) {
  return seriesController.store(request);
}
