import BaseError from "@lib/shared/commons/errors/BaseError";
import prismaClient from "@prismaClient/prismaClient";
import { FilterType, ObjectType } from "@shared/interfaces/base";

export interface StatusFilterType extends FilterType {
  type: string;
}

class StatusService {
  static #instance: StatusService;

  static makeInstance() {
    return StatusService.#instance ?? new StatusService();
  }

  async getStatuses(filter?: StatusFilterType) {
    try {
      let defaultWhere: ObjectType = { deletedAt: null };

      if (!filter) return await prismaClient.status.findMany({ where: defaultWhere });

      const { page, pageSize, orderBy = [{ field: "createdAt", direction: "desc" }], search = "" } = filter;

      if ("search" in filter) {
        defaultWhere = { ...defaultWhere, name: { startsWith: search, contains: search } };
      }

      if ("type" in filter) {
        defaultWhere = {
          ...defaultWhere,
          type: filter.type,
        };
      }

      const query: any = {
        where: defaultWhere,
        orderBy: orderBy.map((order) => ({
          [order.field]: order.direction.toLowerCase(),
        })),
      };

      if (page && pageSize) {
        query.take = pageSize;
        query.skip = (page - 1) * pageSize;
      } else if (pageSize) {
        query.take = pageSize;
      }

      return await prismaClient.status.findMany(query);
    } catch (error) {
      throw new BaseError((error as Error).message);
    }
  }
}

export default StatusService.makeInstance();
