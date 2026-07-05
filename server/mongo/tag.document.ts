import { ObjectId } from "mongodb";

export type TagDocument = {
  _id: ObjectId;
  name: string;
  slug: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
