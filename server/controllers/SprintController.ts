import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import Network from "@lib/utils/network";
import { NextRequest } from "next/server";
import MongoSprintRepository from "server/repositories/MongoSprintRepository";
import LogService from "server/services/LogService";
import { z } from "zod";

export class SprintController {
  static #instance: SprintController;

  static makeInstance() {
    return SprintController.#instance ?? new SprintController();
  }

  async getAll(request: NextRequest) {
    const network = Network(request);
    const filter = network.extractSearchParams();
    try {
      const sprints = await MongoSprintRepository.getSprints(filter);
      return network.successResponse(sprints);
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const sprint = await MongoSprintRepository.getSprint(id);
      return network.successResponse(sprint);
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async store(request: NextRequest) {
    const network = Network(request);
    try {
      const body = await network.getBody();
      const schema = z.object({
        name: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        projectId: z.string().optional(),
        active: z.boolean().optional(),
      });

      const validationResult = schema.safeParse(body);
      if (!validationResult.success) throw new BadRequestError();

      const sprint = await MongoSprintRepository.createSprint(body);
      return network.successResponse(sprint);
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      const body = await network.getBody();
      const updatedSprint = await MongoSprintRepository.updateSprint(id, body);
      return network.successResponse(updatedSprint);
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }

  async destroy(request: NextRequest, { id }: any) {
    const network = Network(request);
    try {
      await MongoSprintRepository.deleteSprint(id);
      return network.successResponse({ message: "Sprint deleted" });
    } catch (error) {
      LogService.log(error);
      return network.failResponse(error as BaseError);
    }
  }
}

export default SprintController.makeInstance();
