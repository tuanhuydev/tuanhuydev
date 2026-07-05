import BadRequestError from "@lib/commons/errors/BadRequestError";
import BaseError from "@lib/commons/errors/BaseError";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { transformTextToDashed } from "@lib/utils/helper";
import { CreateSeriesDTO, createSeriesSchema, UpdateSeriesDTO } from "@server/dto/series.dto";
import { SeriesJSON, SeriesModel } from "@server/models/series.model";
import { authService, AuthService } from "@server/services/AuthService";
import { seriesService } from "@server/services/SeriesService";
import Network from "@server/utils/network";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export class SeriesController {
  public static instance: SeriesController;

  static makeInstance(authService: AuthService) {
    return SeriesController.instance ?? new SeriesController(authService);
  }

  constructor(private readonly authService: AuthService) {}

  async store(request: NextRequest) {
    const network = new Network(request);
    try {
      const body = (await network.getBody()) as CreateSeriesDTO;
      if (body?.name && !body?.slug) {
        body.slug = transformTextToDashed(body.name);
      }
      const validation = createSeriesSchema.safeParse(body);
      if (!validation.success) throw new BadRequestError(validation?.error.toString());

      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const newSeries = (await seriesService.createSeries(body)) as unknown as SeriesModel;
      revalidateTag("series", "max");
      return network.successResponse(newSeries.toJSON());
    } catch (error) {
      console.error(error);
      return network.failResponse(error as BaseError);
    }
  }

  async getAll(request: NextRequest) {
    const network = new Network(request);
    try {
      const params: Record<string, unknown> = network.extractSearchParams();
      const seriesModels: SeriesModel[] = await seriesService.getAllSeries(params);

      const series: SeriesJSON[] = seriesModels.map((item: SeriesModel) => item.toJSON());
      return network.successResponse(series);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async getOne(request: NextRequest, { id }: { id: string }) {
    const network = new Network(request);
    try {
      if (!id) throw new BadRequestError();

      const seriesById = await seriesService.getOneSeries(id);
      if (!seriesById) throw new BadRequestError("Series not found");

      return network.successResponse(seriesById.toJSON());
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async update(request: NextRequest, { id }: { id: string }) {
    const body = (await request.json()) as UpdateSeriesDTO;
    if (body?.slug) {
      body.slug = transformTextToDashed(body.slug);
    }
    if (!id || !body) throw new BadRequestError();

    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const updated = await seriesService.updateSeries(id, body);
      revalidateTag("series", "max");
      return network.successResponse(updated);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }

  async delete(request: NextRequest, { id }: { id: string }) {
    if (!id) throw new BadRequestError();
    const network = new Network(request);
    try {
      const currentUser = await this.authService.getCurrentUserProfile();
      if (!currentUser) throw new UnauthorizedError("Unauthenticated user");

      const deleted = await seriesService.deleteSeries(id);
      revalidateTag("series", "max");
      return network.successResponse(deleted);
    } catch (error) {
      return network.failResponse(error as BaseError);
    }
  }
}

export const seriesController = SeriesController.makeInstance(authService);
