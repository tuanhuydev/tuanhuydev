import { NextRequest } from "next/server";

type ControllerMethod = (req: NextRequest, params?: any) => Promise<any>;
export interface BaseController {
  store: ControllerMethod;
  getAll: ControllerMethod;
  update: ControllerMethod;
  delete: ControllerMethod;
}
