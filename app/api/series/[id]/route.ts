import { NextRequest } from "next/server";
import { seriesController } from "server/controllers/SeriesController";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return seriesController.getOne(request, params);
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return seriesController.update(request, params);
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  return seriesController.delete(request, params);
}
