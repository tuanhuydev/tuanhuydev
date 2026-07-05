import { ObjectId } from "mongodb";

export type PostDocument = {
  _id: ObjectId;
  title: string;
  content: string;
  thumbnail?: string;
  slug: string;
  authorId: ObjectId | null;
  assets: string[];
  categoryId: ObjectId | null;
  seriesId: ObjectId | null;
  tagIds: ObjectId[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
};
