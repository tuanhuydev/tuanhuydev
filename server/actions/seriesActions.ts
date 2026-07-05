"use server";

import { SeriesJSON, SeriesModel } from "@server/models/series.model";
import { seriesService } from "@server/services/SeriesService";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const fetchSeries = unstable_cache(
  async (filter: Record<string, unknown> = {}): Promise<SeriesJSON[]> => {
    const seriesModels: SeriesModel[] = (await seriesService.getAllSeries(filter)) ?? [];
    return seriesModels.map((seriesModel) => seriesModel.toJSON());
  },
  ["series"],
  { revalidate: 3600, tags: ["series"] },
);

export const getAllSeries = cache(async (filter: Record<string, unknown> = {}): Promise<SeriesJSON[]> => {
  return fetchSeries(filter);
});

export const getSeriesById = cache(async (id: string): Promise<SeriesJSON | null> => {
  const seriesModel = await seriesService.getOneSeries(id);
  return seriesModel ? seriesModel.toJSON() : null;
});
