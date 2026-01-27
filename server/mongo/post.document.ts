import { ObjectId } from "mongodb";

export type PostDocument = {
  _id: ObjectId;
  title: string;
  content: string;
  thumbnail?: string;
  slug: string;
  authorId: ObjectId | null;
  assets: string[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  publishedAt: string | null;
};
