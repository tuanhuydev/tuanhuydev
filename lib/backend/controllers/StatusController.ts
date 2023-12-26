import serviceService, { StatusFilterType } from "../services/StatusService";
import BaseError from "@lib/shared/commons/errors/BaseError";
import { ObjectType } from "@lib/shared/interfaces/base";
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

      const statuses = await serviceService.getStatuses(params as StatusFilterType);
      return network.successResponse(statuses);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export default StatusController.makeInstance();
