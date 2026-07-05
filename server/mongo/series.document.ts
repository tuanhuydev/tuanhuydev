import { ObjectId } from "mongodb";

export type SeriesDocument = {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
