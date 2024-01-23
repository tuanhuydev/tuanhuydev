import StatusService, { StatusFilterType } from "../services/StatusService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import Network from "@lib/shared/utils/network";
import { NextRequest } from "next/server";

class StatusController {
  static #instance: StatusController;

  static makeInstance() {
    return StatusController.#instance ?? new StatusController();
  }

  constructor() {}

  async getAll(request: NextRequest) {
    const network = Network(request);
    try {
      const params: ObjectType = network.extractSearchParams();

      const status = await StatusService.getStatus(params as StatusFilterType);
      return network.successResponse(status);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const status = await StatusService.getStatusById(Number.parseInt(id));
      return network.successResponse(status);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async store(request: NextRequest) {
    const network = Network(request);
    try {
      const body = await request.json();
      const status = await StatusService.createStatus(body);
      return network.successResponse(status);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const body = await request.json();
      const status = await StatusService.updateStatus(Number.parseInt(id), body);
      return network.successResponse(status);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
  async delete(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const status = await StatusService.deleteStatus(Number.parseInt(id));
      return network.successResponse(status);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default StatusController.makeInstance();
