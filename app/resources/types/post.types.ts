import { ISODateString } from "./common.types";

export interface Post {
  id?: string;
  title: string;
  content: string;
  thumbnail?: string;
  publishedAt: ISODateString | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  deletedAt: ISODateString | null;
  slug: string;
  authorId: string | null;
  assets: string[];
  categoryId: string | null;
  seriesId: string | null;
  tagIds: string[];
}
