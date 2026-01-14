import { NextRequest } from "next/server";

type ControllerMethod = (req: NextRequest, params?: unknown) => Promise<unknown>;

export interface BaseController {
  store: ControllerMethod;
  getAll: ControllerMethod;
  update: ControllerMethod;
  delete: ControllerMethod;
}
